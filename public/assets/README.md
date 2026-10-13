# 3D Avatar Model Integration Guide

This directory is ready for your custom 3D character model.

### How to Add Your 3D Character:
1. Place your 3D model file in this folder and name it:
   `character.glb` (or `character.gltf`)
   
2. The museum will automatically detect and load your 3D model, replacing the procedural architectural mannequin with your character.

3. **Supported Formats**:
   - `.glb` (Binary GLTF — Recommended)
   - `.gltf` (GLTF JSON with textures / bin)

4. **Supported Animation Tracks**:
   - `Walk`, `walk`, or `Walking` — Automatically played and synchronized to the scroll stroll speed.
   - `Idle`, `idle` — Played when the avatar stops.

If no file is placed here, the museum seamlessly renders the built-in procedural architectural silhouette avatar with fluid walking kinematics.
