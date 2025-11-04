// BPMNPanel.js
import * as THREE from './three.module.js';

export function createBPMNPanel() {
  const group = new THREE.Group();

  // Title
  const titleTex = textTexture('Simple BPMN Process', 520, 64, 24, 'center');
  const titleMat = new THREE.MeshBasicMaterial({ map: titleTex, transparent: true });
  const titleQuad = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.12), titleMat);
  titleQuad.position.set(0, 0.26, 0.001);
  group.add(titleQuad);

  // Define process nodes: Start, 3 Tasks, End
  const nodes = [
    { id: 'start', label: 'Start', type: 'event' },
    { id: 't1', label: 'Receive Order', type: 'task' },
    { id: 't2', label: 'Check Stock', type: 'task' },
    { id: 't3', label: 'Send Confirmation', type: 'task' },
    { id: 'end', label: 'End', type: 'event' }
  ];

  const startX = -0.64;
  nodes.forEach((n, i) => {
    let card;
    if (n.type === 'event') {
      card = createEventNode(n.label, n.id === 'start' ? 0x00ff88 : 0xff4444);
    } else {
      card = createTaskNode(n.label);
    }
    card.position.set(startX + i * 0.32, 0, 0.01);
    card.userData = { id: n.id, label: n.label, type: n.type };
    group.add(card);
    // Add arrow between nodes except after last
    if (i < nodes.length - 1) {
      const arrow = createArrow();
      arrow.position.set(startX + i * 0.32 + 0.16, 0, 0.011);
      group.add(arrow);
    }
  });

  // small instruction text
  const instrTex = textTexture('Tap nodes to select', 520, 48, 16, 'center');
  const instrMat = new THREE.MeshBasicMaterial({ map: instrTex, transparent: true });
  const instrQuad = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.08), instrMat);
  instrQuad.position.set(0, -0.28, 0.001);
  group.add(instrQuad);

  // make group face the user by default
  group.lookAt(new THREE.Vector3(0,1.6,0));

  return group;
}

// Task node: rounded rectangle + label
function createTaskNode(text) {
  const tex = textTexture(text, 256, 128, 18, 'center');
  // Aesthetic task: blue background, white border, drop shadow
  const shape = new THREE.Shape();
  const w = 0.28, h = 0.16, r = 0.04;
  shape.moveTo(-w/2 + r, -h/2);
  shape.lineTo(w/2 - r, -h/2);
  shape.quadraticCurveTo(w/2, -h/2, w/2, -h/2 + r);
  shape.lineTo(w/2, h/2 - r);
  shape.quadraticCurveTo(w/2, h/2, w/2 - r, h/2);
  shape.lineTo(-w/2 + r, h/2);
  shape.quadraticCurveTo(-w/2, h/2, -w/2, h/2 - r);
  shape.lineTo(-w/2, -h/2 + r);
  shape.quadraticCurveTo(-w/2, -h/2, -w/2 + r, -h/2);
  const geo = new THREE.ShapeGeometry(shape);
  // Main task body
  const bodyMat = new THREE.MeshBasicMaterial({ color: 0x2196f3, opacity: 0.95, transparent: true });
  const body = new THREE.Mesh(geo, bodyMat);
  // White border
  const borderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.9, transparent: true });
  const border = new THREE.Mesh(geo.clone(), borderMat);
  border.scale.set(1.04, 1.08, 1);
  border.position.set(0,0,-0.002);
  body.add(border);
  // Drop shadow
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.18, transparent: true });
  const shadow = new THREE.Mesh(geo.clone(), shadowMat);
  shadow.scale.set(1.08, 1.12, 1);
  shadow.position.set(0,-0.01,-0.003);
  body.add(shadow);
  // Text label
  const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.07), labelMat);
  label.position.set(0,0,0.004);
  body.add(label);
  return body;
}

// Event node: circle + label
function createEventNode(text, color=0x00ff88) {
  const group = new THREE.Group();
  // Main event circle
  const circleGeo = new THREE.CircleGeometry(0.09, 32);
  const circleMat = new THREE.MeshBasicMaterial({ color, opacity:0.95, transparent:true });
  const circle = new THREE.Mesh(circleGeo, circleMat);
  group.add(circle);
  // White border
  const borderMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.9, transparent: true });
  const border = new THREE.Mesh(circleGeo.clone(), borderMat);
  border.scale.set(1.08, 1.08, 1);
  border.position.set(0,0,-0.002);
  group.add(border);
  // Drop shadow
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.18, transparent: true });
  const shadow = new THREE.Mesh(circleGeo.clone(), shadowMat);
  shadow.scale.set(1.14, 1.14, 1);
  shadow.position.set(0,-0.01,-0.003);
  group.add(shadow);
  // label
  const tex = textTexture(text, 128, 64, 16, 'center');
  const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.06), mat);
  label.position.set(0, -0.13, 0.004);
  group.add(label);
  return group;
}

// Arrow: simple triangle
function createArrow() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.04, -0.02);
  shape.lineTo(0.04, 0);
  shape.lineTo(-0.04, 0.02);
  shape.lineTo(-0.04, -0.02);
  const geo = new THREE.ShapeGeometry(shape);
  // Accent color for arrows
  const mat = new THREE.MeshBasicMaterial({ color:0xffc107, opacity:0.85, transparent:true });
  const mesh = new THREE.Mesh(geo, mat);
  // Drop shadow
  const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0.18, transparent: true });
  const shadow = new THREE.Mesh(geo.clone(), shadowMat);
  shadow.position.set(0,-0.01,-0.003);
  mesh.add(shadow);
  return mesh;
}

// helper: create a canvas texture with text
function textTexture(text, width=512, height=128, fontSize=28, align='left') {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0,0,width,height);
  ctx.font = `${fontSize}px Arial`;
  ctx.fillStyle = '#ff0'; // bright yellow for visibility
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const x = align === 'center' ? width/2 : 12;
  ctx.fillText(text, x, height/2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
