/*!
 * THREE.Extras.UTils contains extra useful methods
 * 
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * 
 */

THREE = THREE || {};
THREE.Extras = THREE.Extras || {};
THREE.Extras.Utils = THREE.Extras.Utils || {};

/*! Projects object origin into screen space coordinates using provided camera */
THREE.Extras.Utils.projectOnScreen = function(object, camera)
{
	var pos = new THREE.Vector3();
	var mat = new THREE.Matrix4();
	mat.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
	pos.setFromMatrixPosition(object.matrixWorld);
	pos.applyProjection(mat);

	return pos;
}

/*!
 * THREE.Extras.Shaders contains extra Fx shaders like godrays
 * 
 * @author Thibaut 'BKcore' Despoulain <http://bkcore.com>
 * 
 */

THREE = THREE || {};
THREE.Extras = THREE.Extras || {};

THREE.Extras.Shaders = {
	// Volumetric Light Approximation (Godrays)
	Godrays: {
		uniforms: {
			tDiffuse: {type: "t", value: null},

			fX0: {type: "f", value: 0.5},
			fY0: {type: "f", value: 1.0},
			fExposure0: {type: "f", value: 0.6},
			fDecay0: {type: "f", value: 0.88},
			fDensity0: {type: "f", value: 0.72},
			fWeight0: {type: "f", value: 0.6},
			fClamp0: {type: "f", value: 1.0},

			fX1: {type: "f", value: 0.0},
			fY1: {type: "f", value: 0.0},
			fExposure1: {type: "f", value: 0.6},
			fDecay1: {type: "f", value: 0.88},
			fDensity1: {type: "f", value: 0.72},
			fWeight1: {type: "f", value: 0.6},
			fClamp1: {type: "f", value: 1.0},

			fX2: {type: "f", value: 1.0},
			fY2: {type: "f", value: 0.0},
			fExposure2: {type: "f", value: 0.6},
			fDecay2: {type: "f", value: 0.88},
			fDensity2: {type: "f", value: 0.72},
			fWeight2: {type: "f", value: 0.6},
			fClamp2: {type: "f", value: 1.0}
		},

		vertexShader: [
			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"
		].join("\n"),

		fragmentShader: [
			"varying vec2 vUv;",
			"uniform sampler2D tDiffuse;",

			"uniform float fX0;",
			"uniform float fY0;",
			"uniform float fExposure0;",
			"uniform float fDecay0;",
			"uniform float fDensity0;",
			"uniform float fWeight0;",
			"uniform float fClamp0;",

			"uniform float fX1;",
			"uniform float fY1;",
			"uniform float fExposure1;",
			"uniform float fDecay1;",
			"uniform float fDensity1;",
			"uniform float fWeight1;",
			"uniform float fClamp1;",

			"uniform float fX2;",
			"uniform float fY2;",
			"uniform float fExposure2;",
			"uniform float fDecay2;",
			"uniform float fDensity2;",
			"uniform float fWeight2;",
			"uniform float fClamp2;",

			"const int iSamples = 20;",

			"void main()",
			"{",
				"float fExposure;",
				"float fDecay;",
				"float fDensity;",
				"float fWeight;",
				"float fClamp;",
				"vec2 d0 = vUv - vec2(fX0,fY0); vec2 d1 = vUv - vec2(fX1, fY1); vec2 d2 = vUv - vec2(fX2, fY2);",
				"vec2 deltaTextCoord;",
				"if (length(d0) < length(d1) && length(d0) < length(d2)) {",
					"deltaTextCoord = d0;",
					"fExposure = fExposure0; fDecay = fDecay0; fDensity = fDensity0; fWeight = fWeight0; fClamp = fClamp0;",
				"} else if (length(d1) < length(d2)) {",
					"deltaTextCoord = d1;",
					"fExposure = fExposure1; fDecay = fDecay1; fDensity = fDensity1; fWeight = fWeight1; fClamp = fClamp1;",
				"} else {",
					"deltaTextCoord = d2;",
					"fExposure = fExposure2; fDecay = fDecay2; fDensity = fDensity2; fWeight = fWeight2; fClamp = fClamp2;",
				"}",
				"if (length(deltaTextCoord) > 0.1) {",
					"gl_FragColor = texture2D(tDiffuse, vUv);",
				"} else {",
					"deltaTextCoord *= 1.0 /  float(iSamples) * fDensity;",
					"vec2 coord = vUv;",
					"float illuminationDecay = 1.0;",
					"vec4 FragColor = vec4(0.0);",

					"for(int i=0; i < iSamples ; i++)",
					"{",
						"coord -= deltaTextCoord;",
						"vec4 texel = texture2D(tDiffuse, coord);",
						"texel *= illuminationDecay * fWeight;",

						"FragColor += texel;",

						"illuminationDecay *= fDecay;",
					"}",
					"FragColor *= fExposure;",
					"FragColor = clamp(FragColor, 0.0, fClamp);",
					"gl_FragColor = FragColor;",
				"}",
			"}"
		].join("\n")
	},

	// Coeff'd additive buffer blending
	Additive: {
		uniforms: {
			tDiffuse: { type: "t", value: null },
			tAdd: { type: "t", value: null },
			fCoeff: { type: "f", value: 1.0 }
		},

		vertexShader: [
			"varying vec2 vUv;",

			"void main() {",

				"vUv = uv;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

			"}"
		].join("\n"),

		fragmentShader: [
			"uniform sampler2D tDiffuse;",
			"uniform sampler2D tAdd;",
			"uniform float fCoeff;",

			"varying vec2 vUv;",

			"void main() {",

				"vec4 texel = texture2D( tDiffuse, vUv );",
				"vec4 add = texture2D( tAdd, vUv );",
				"gl_FragColor = texel + add * fCoeff;",

			"}"
		].join("\n")
	}
};