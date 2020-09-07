//from https://shadertoyunofficial.wordpress.com/2019/01/02/programming-tricks-in-shadertoy-glsl/


//Some operations on complexes: ( vec2 Z  means  Z.x + i Z.y  )

// add, sub;  mul or div by float : just use +, -, *, /
#define cmod(Z)     length(Z)
#define carg(Z)     atan( (Z).y, (Z).x )
#define cmul(A,B) ( mat2( A, -(A).y, (A).x ) * (B) )  // by deMoivre formula
#define cinv(Z)   ( vec2( (Z).x, -(Z).y ) / dot(Z,Z) ) 
#define cdiv(A,B)   cmul( A, cinv(B) )
#define cpow(Z,v)   pol2cart( vec2( pow(cmod(Z),v) , (v) * carg(Z) ) )
#define cpow(A,B)   cexp( cmul( B, clog(A) ) )
#define cexp(Z)     pol2cart( vec2( exp((Z).x), (Z).y ) )
#define clog(Z)     vec2( log(cmod(Z)), carg(Z) )
