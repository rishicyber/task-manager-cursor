const fs = require('fs');
const { createCanvas } = require('canvas');

// Function to create a simple task manager icon
function createIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#282c34';
    ctx.fillRect(0, 0, size, size);
    
    // Main circle background
    const center = size / 2;
    const radius = size * 0.4;
    
    // Gradient background
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, radius);
    gradient.addColorStop(0, '#61dafb');
    gradient.addColorStop(1, '#56b6c2');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = '#21252b';
    ctx.lineWidth = size * 0.03;
    ctx.stroke();
    
    // Task list rectangle
    const listWidth = size * 0.5;
    const listHeight = size * 0.56;
    const listX = center - listWidth / 2;
    const listY = center - listHeight / 2 + size * 0.05;
    
    ctx.fillStyle = '#21252b';
    ctx.globalAlpha = 0.9;
    ctx.fillRect(listX, listY, listWidth, listHeight);
    ctx.globalAlpha = 1;
    
    // Task items
    const itemSpacing = listHeight / 4;
    const itemY1 = listY + itemSpacing;
    const itemY2 = listY + itemSpacing * 2;
    const itemY3 = listY + itemSpacing * 3;
    const checkX = listX + size * 0.08;
    const textX = listX + size * 0.2;
    const textWidth = listWidth * 0.6;
    const textHeight = size * 0.12;
    
    // Task 1 (checked)
    ctx.strokeStyle = '#61dafb';
    ctx.lineWidth = size * 0.02;
    ctx.beginPath();
    ctx.moveTo(checkX - size * 0.03, itemY1 - size * 0.02);
    ctx.lineTo(checkX + size * 0.03, itemY1 + size * 0.02);
    ctx.moveTo(checkX + size * 0.03, itemY1 - size * 0.02);
    ctx.lineTo(checkX - size * 0.03, itemY1 + size * 0.02);
    ctx.stroke();
    
    ctx.fillStyle = '#3a3f4b';
    ctx.fillRect(textX, itemY1 - textHeight/2, textWidth, textHeight);
    
    // Task 2 (checked)
    ctx.beginPath();
    ctx.moveTo(checkX - size * 0.03, itemY2 - size * 0.02);
    ctx.lineTo(checkX + size * 0.03, itemY2 + size * 0.02);
    ctx.moveTo(checkX + size * 0.03, itemY2 - size * 0.02);
    ctx.lineTo(checkX - size * 0.03, itemY2 + size * 0.02);
    ctx.stroke();
    
    ctx.fillRect(textX, itemY2 - textHeight/2, textWidth, textHeight);
    
    // Task 3 (unchecked)
    ctx.beginPath();
    ctx.arc(checkX, itemY3, size * 0.04, 0, 2 * Math.PI);
    ctx.stroke();
    
    ctx.fillRect(textX, itemY3 - textHeight/2, textWidth, textHeight);
    
    // Plus icon
    const plusX = center + radius * 0.6;
    const plusY = center - radius * 0.6;
    const plusRadius = size * 0.09;
    
    ctx.fillStyle = '#e06c75';
    ctx.beginPath();
    ctx.arc(plusX, plusY, plusRadius, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.strokeStyle = 'white';
    ctx.lineWidth = size * 0.015;
    ctx.beginPath();
    ctx.moveTo(plusX, plusY - plusRadius * 0.5);
    ctx.lineTo(plusX, plusY + plusRadius * 0.5);
    ctx.moveTo(plusX - plusRadius * 0.5, plusY);
    ctx.lineTo(plusX + plusRadius * 0.5, plusY);
    ctx.stroke();
    
    return canvas.toBuffer('image/png');
}

// Create icons in different sizes
const sizes = [16, 32, 48, 128];

sizes.forEach(size => {
    const buffer = createIcon(size);
    fs.writeFileSync(`icons/icon${size}.png`, buffer);
    console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!'); 