#define PI 3.14159265359
#define TWO_PI 6.28318530718

float fillCircle(in vec2 _st,  in vec2 _pos, in float _radius){
    _radius *= PI;
    _radius *= _radius;
    vec2 dist = _st-vec2(_pos);
	return 1.-smoothstep(_radius-(_radius*0.005),
                         _radius+(_radius*0.005),
                         dot(dist,dist)*PI*PI);
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
    
// Reference to
// http://thndl.com/square-shaped-shaders.html
float fillRegularPolygon(vec2 st, vec2 pos, int Nsides, float radius, float angle){
    
    st -= pos - 0.5;

    //remap space to -1. to 1.
    st = st *2.-1.;
    
	float a=atan(st.x,st.y)+PI;
	float b=TWO_PI/float(Nsides);
    a+=angle;
	return 1.-smoothstep(radius,radius+0.01, cos(floor(.5+a/b)*b-a)*length(st));
}
