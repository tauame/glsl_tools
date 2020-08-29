vec2 flipHorizontal(vec2 v){
    return (vec3(v,1.)*mat3(1.,0.,0.,0.,-1.,1.,0.,0.,1.)).xy;
}

vec2 flipHorizontal(float v2){
    return flipHorizontal(vec2(v2));
}

vec2 flipVertical(vec2 v){
    return (vec3(v,1.)*mat3(-1.,0.,1.,0.,1.,0.,0.,0.,1.)).xy;
}

vec2 flipVertical(float v2){
    return flipHorizontal(vec2(v2));
}

//  Function from Iñigo Quiles
//  https://www.shadertoy.com/view/MsS3Wc
vec3 hsb2rgb( in vec3 c ){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                             6.0)-3.0)-1.0,
                     0.0,
                     1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
}
