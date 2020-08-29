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
