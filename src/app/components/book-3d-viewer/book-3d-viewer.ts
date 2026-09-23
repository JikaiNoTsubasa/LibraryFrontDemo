// =============================================================================
// BOOK 3D VIEWER COMPONENT - Three.js
// Real 3D book model with texture mapping and mouse controls
// =============================================================================

import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  AfterViewInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-book-3d-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-3d-viewer.html',
  styleUrl: './book-3d-viewer.scss',
})
export class Book3DViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() coverImage!: string;
  @Input() title!: string;
  @Input() author!: string;

  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  // Three.js objects
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls!: OrbitControls;
  private book!: THREE.Group;
  private animationId!: number;

  // Loading state
  isLoading = signal(true);
  loadingProgress = signal(0);

  // Auto-rotate state
  isAutoRotating = signal(true);
  private autoRotateSpeed = 0.005;

  ngOnInit() {}

  ngAfterViewInit() {
    this.initThreeJS();
    this.createBook();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.controls) {
      this.controls.dispose();
    }
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  /**
   * Initialize Three.js scene, camera, renderer, and controls
   */
  private initThreeJS() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f); // Dark purple background

    // Camera - positioned to show front cover
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.set(0, 0.5, 4); // More front-facing view
    this.camera.lookAt(0, 0, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;

    // Orbit Controls (mouse rotation)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.minDistance = 2.5;
    this.controls.maxDistance = 8;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    this.controls.target.set(0, 0, 0); // Look at center of book
    this.controls.autoRotate = this.isAutoRotating();
    this.controls.autoRotateSpeed = 1.5; // Slower, smoother rotation

    // Listen for user interaction to stop auto-rotate
    this.controls.addEventListener('start', () => {
      this.isAutoRotating.set(false);
      this.controls.autoRotate = false;
    });

    // Lighting
    this.addLighting();

    // Handle window resize
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  /**
   * Add lighting to the scene
   */
  private addLighting() {
    // Ambient light - increased for better texture visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambientLight);

    // Directional light (main light) - positioned to illuminate front cover
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
    mainLight.position.set(2, 3, 5); // Front lighting
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    this.scene.add(mainLight);

    // Back light for depth
    const backLight = new THREE.DirectionalLight(0xffd700, 0.6); // Golden accent
    backLight.position.set(-3, 2, -3);
    this.scene.add(backLight);

    // Rim light (cyan accent)
    const rimLight = new THREE.DirectionalLight(0x00d4ff, 0.5);
    rimLight.position.set(5, 0, -2);
    this.scene.add(rimLight);
  }

  /**
   * Load image with proper CORS handling
   */
  private loadCoverImage(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        console.log('Image loaded successfully via HTMLImageElement');
        resolve(img);
      };

      img.onerror = (error) => {
        console.error('Image load error:', error);
        reject(error);
      };

      console.log('Loading image:', this.coverImage);
      img.src = this.coverImage;
    });
  }

  /**
   * Create the 3D book model with cover texture
   */
  private async createBook() {
    this.book = new THREE.Group();

    // Book dimensions (realistic proportions)
    const bookWidth = 1.5; // Width
    const bookHeight = 2.1; // Height
    const bookDepth = 0.3; // Thickness

    try {
      // Try to load the image first
      const img = await this.loadCoverImage();

      // Create texture from loaded image
      const coverTexture = new THREE.Texture(img);
      coverTexture.colorSpace = THREE.SRGBColorSpace;
      coverTexture.needsUpdate = true;
      coverTexture.flipY = true; // Flip vertically - GOOD

      // Don't flip horizontally - remove the negative repeat
      coverTexture.repeat.set(1, 1);
      coverTexture.offset.set(0, 0);

      coverTexture.wrapS = THREE.ClampToEdgeWrapping;
      coverTexture.wrapT = THREE.ClampToEdgeWrapping;
      coverTexture.minFilter = THREE.LinearFilter;
      coverTexture.magFilter = THREE.LinearFilter;

      console.log('Texture created from image:', coverTexture);

      this.createBookMesh(bookWidth, bookHeight, bookDepth, coverTexture);
      this.isLoading.set(false);
    } catch (error) {
      console.error('Failed to load cover image, using fallback:', error);
      this.createFallbackBook(bookWidth, bookHeight, bookDepth);
      this.isLoading.set(false);
    }
  }

  /**
   * Create the book mesh with materials
   */
  private createBookMesh(
    bookWidth: number,
    bookHeight: number,
    bookDepth: number,
    coverTexture: THREE.Texture
  ) {
    // Create materials for each face of the book
    const materials = [
      // Right side (pages edge) - white with lines
      this.createPagesMaterial(),
      // Left side (spine) - dark with title
      this.createSpineMaterial(),
      // Top edge
      new THREE.MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.8 }),
      // Bottom edge
      new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 }),
      // Front cover - use the cover image
      new THREE.MeshStandardMaterial({
        map: coverTexture,
        roughness: 0.4,
        metalness: 0.0,
        side: THREE.FrontSide,
      }),
      // Back cover - dark gradient
      new THREE.MeshStandardMaterial({
        color: 0x2a2050,
        roughness: 0.5,
        metalness: 0.2,
      }),
    ];

    // Create book geometry
    const geometry = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
    const bookMesh = new THREE.Mesh(geometry, materials);
    bookMesh.castShadow = true;
    bookMesh.receiveShadow = true;

    console.log('BookMesh created:', bookMesh);
    console.log('Materials array:', materials);
    console.log('Front cover material (index 4):', materials[4]);
    console.log('Front cover has texture map:', materials[4].map);

    this.book.add(bookMesh);

    // Add golden border frame on front cover
    this.addCoverBorder(bookWidth, bookHeight, bookDepth);

    // Add glow effect
    this.addGlowEffect(bookWidth, bookHeight, bookDepth);

    // Position book to show cover facing camera (no rotation, perfectly front-facing)
    this.book.rotation.set(0, 0, 0);

    this.scene.add(this.book);

    console.log('Book group added to scene');
    console.log('Book position:', this.book.position);
    console.log('Book rotation:', this.book.rotation);
  }


  /**
   * Create material for pages edge (right side)
   */
  private createPagesMaterial(): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Create paper texture with lines
    ctx.fillStyle = '#f5f5f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add page lines
    ctx.strokeStyle = '#e0e0d0';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.height; i += 4) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.9,
      metalness: 0,
    });
  }

  /**
   * Create material for spine (left side)
   */
  private createSpineMaterial(): THREE.MeshStandardMaterial {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#2a2050');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add title text (rotated for spine)
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.title.substring(0, 20), 0, 10);
    ctx.restore();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    return new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.6,
      metalness: 0.1,
    });
  }

  /**
   * Add golden border to front cover - as a thin frame around the edge
   */
  private addCoverBorder(width: number, height: number, depth: number) {
    const borderThickness = 0.05;
    const borderDepth = 0.005;
    const borderMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffd700,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });

    const zPos = (depth / 2) + (borderDepth / 2);

    // Top border
    const topBorder = new THREE.Mesh(
      new THREE.BoxGeometry(width, borderThickness, borderDepth),
      borderMaterial
    );
    topBorder.position.set(0, height / 2 + borderThickness / 2, zPos);
    this.book.add(topBorder);

    // Bottom border
    const bottomBorder = new THREE.Mesh(
      new THREE.BoxGeometry(width, borderThickness, borderDepth),
      borderMaterial
    );
    bottomBorder.position.set(0, -height / 2 - borderThickness / 2, zPos);
    this.book.add(bottomBorder);

    // Left border
    const leftBorder = new THREE.Mesh(
      new THREE.BoxGeometry(borderThickness, height + borderThickness * 2, borderDepth),
      borderMaterial
    );
    leftBorder.position.set(-width / 2 - borderThickness / 2, 0, zPos);
    this.book.add(leftBorder);

    // Right border
    const rightBorder = new THREE.Mesh(
      new THREE.BoxGeometry(borderThickness, height + borderThickness * 2, borderDepth),
      borderMaterial
    );
    rightBorder.position.set(width / 2 + borderThickness / 2, 0, zPos);
    this.book.add(rightBorder);
  }

  /**
   * Add glow effect around the book
   */
  private addGlowEffect(width: number, height: number, depth: number) {
    const glowGeometry = new THREE.BoxGeometry(
      width + 0.1,
      height + 0.1,
      depth + 0.1
    );
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xffd700,
      transparent: true,
      opacity: 0.1,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.book.add(glow);
  }

  /**
   * Create fallback book (if texture fails to load)
   */
  private createFallbackBook(width: number, height: number, depth: number) {
    const fallbackMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a6a,
      roughness: 0.5,
    });
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const bookMesh = new THREE.Mesh(geometry, fallbackMaterial);
    this.book.add(bookMesh);
    this.scene.add(this.book);
  }

  /**
   * Animation loop
   */
  private animate() {
    this.animationId = requestAnimationFrame(() => this.animate());

    // Update controls
    this.controls.update();

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Handle window resize
   */
  private onWindowResize() {
    const canvas = this.canvasRef.nativeElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Toggle auto-rotation
   */
  toggleAutoRotate() {
    this.isAutoRotating.update((value) => !value);
    this.controls.autoRotate = this.isAutoRotating();
  }

  /**
   * Reset camera view
   */
  resetView() {
    this.camera.position.set(3, 2, 5);
    this.camera.lookAt(0, 0, 0);
    this.controls.reset();
  }
}
