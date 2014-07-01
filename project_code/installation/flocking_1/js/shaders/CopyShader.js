/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join("\n")

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.FlipXShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vec2(1.0-vUv.x, vUv.y) );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join("\n")

};


THREE.Merge4Shader = {

	uniforms: {

		"t0": { type: "t", value: null },
		"t1": { type: "t", value: null },
		"t2": { type: "t", value: null },
		"t3": { type: "t", value: null }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D t0;",
		"uniform sampler2D t1;",
		"uniform sampler2D t2;",
		"uniform sampler2D t3;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( t0, vec2(vUv.x, vUv.y) );",
			"texel += texture2D( t1, vec2(vUv.x, vUv.y) );",
			"texel += texture2D( t2, vec2(vUv.x, vUv.y) );",
			"texel += texture2D( t3, vec2(vUv.x, vUv.y) );",
			"gl_FragColor = 0.25 * texel;",

		"}"

	].join("\n")

};


