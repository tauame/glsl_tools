float fillCircle(in vec2 _st,  in vec2 _pos, in float _diam){
    vec2 dist = _st-vec2(_pos);
	return 1.-smoothstep(_diam-(_diam*0.01),
                         _diam+(_diam*0.01),
                         dot(dist,dist)*4.0);
}

float circle(in vec2 _st,  in vec2 _pos, in float _diam, in float _thickness){
    return fillCircle(_st, _pos, _diam) - fillCircle(_st, _pos,_diam-(_thickness*2.));
}

vec3 fillRect(vec2 st, vec2 pos, vec2 size){
    vec2 bl = step(pos,st);       // bottom-left
    vec2 tr = 1.-step(pos+size,st);   // top-right
    return vec3(bl.x * bl.y * tr.x * tr.y); 
}

vec3 rect(vec2 st, vec2 pos, vec2 size, float thickness){
    return fillRect(st, pos, size) - fillRect(st, pos+thickness, size-2.*thickness);
    
