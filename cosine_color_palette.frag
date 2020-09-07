//Shadertoy URL: https://www.shadertoy.com/view/tlSBDw

/*

Customizable cosine color palette

Press the R, G, B, T, H and N keys on your keyboard while dragging with the mouse to change the shape of the cosine function;


Usage:

 
Hold R or G or B keys while moving the mouse along the X axis: 
  change the corresponding color wave offset on the Y axist (a paramenter)

Hold R or G or B keys while moving the mouse along the Y axis: 
  scale the corresponding color wave on the Y axis (b parameter)

Hold T or H or N keys while moving the mouse along the Y axis: 
  change the corresponding color wave frequency from 0. up to 3. (c parameter)

Hold T or H or N keys while moving the mouse along the X axis: 
  change the phase of the corresponding color wave  (d parameter)



You only fully control the first row. Rows 2 through 7 are random variations 
of the first row by changing the 'd' parameter of the palette function.
Also, you can change which keys control each color by changing the define 
keyvalues in the "Common" tab. I choose RGBTHN for my own confort.

Based on https://www.shadertoy.com/view/ll2GD3

*/


/*SHADERTOY INFO:
iChannel0: BufferA
iChannel1: Font 1 Texture
iChannel2: RGBA Noise Medium Texture
*/


//cosine color pallete from https://iquilezles.org/www/articles/palettes/palettes.htm
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d){

	return a + b * cos(TAU*(c*t + d));
    
}


//from https://www.shadertoy.com/view/llySRh
#define TEXTCHANNEL iChannel1

// --- chars
int CAPS=0;
#define low CAPS=32;
#define caps CAPS=0;
#define spc  U.x-=.5;
#define C(c) spc fragColor+= char(U,64+CAPS+c);

int char_id = -1; vec2 char_pos, dfdx, dfdy; 
vec4 char(vec2 p, int c) {
    vec2 dFdx = dFdx(p/16.), dFdy = dFdy(p/16.);
 // if ( p.x>.25&& p.x<.75 && p.y>.0&& p.y<1. )  // normal char box
    if ( p.x>.25&& p.x<.75 && p.y>.1&& p.y<.85 ) // thighly y-clamped to allow dense text
        char_id = c, char_pos = p, dfdx = dFdx, dfdy = dFdy;
    return vec4(0);
}
vec4 draw_char() {
    int c = char_id; vec2 p = char_pos;
    return c < 0 
        ? vec4(0,0,0,1e5)
        : textureGrad( TEXTCHANNEL, p/16. + fract( vec2(c, 15-c/16) / 16. ), 
                       dfdx, dfdy );
}

// --- display int3

vec4 pInt(vec2 p, float n, float size) {
    vec4 v = vec4(0);
    if (n < 0.) 
        v += char(p - vec2(-.5,0), 45 ),
        n = -n;

    for (float i = size-1.; i>=0.; i--) 
        n /=  9.999999, // 10., // for windows :-(
        v += char(p - .5*vec2(i,0), 48+ int(fract(n)*10.) );
    return v;
}

// --- display float1.3
vec4 pFloat(vec2 p, float n) {
    vec4 v = vec4(0);
    if (n < 0.) v += char(p - vec2(-.5,0), 45 ), n = -n;
    v += pInt(p,floor(n),1.); p.x -= .5;
    v += char(p, 46);      p.x -= .5;
    v += pInt(p,fract(n)*1e3,3.);
    return v;
}



//from https://www.shadertoy.com/view/Ms2SD1
float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 m = iMouse.xy/iResolution.xy;
    
    vec2 U;

    
   
    
    uv.y*=7.;
    uv+=1.;
    
    vec2 i_uv = floor(uv);
    vec2 f_uv = fract(uv);


    //float seed = noise(vec2(iTime)*.01);
    float seed = iTime*.03;


    vec3 col;

    
    
    
    vec3 a = texelFetch(iChannel0,ivec2(1),0).rgb;
    
    vec3 b = texelFetch(iChannel0,ivec2(2),0).rgb;
    vec3 c = texelFetch(iChannel0,ivec2(3),0).rgb;
    vec3 d;
    if(i_uv.y<=6.)
    	//d = vec3(noise(i_uv*seed*.8),noise(i_uv*seed*1.3),noise(i_uv.yx*seed));
        d = texelFetch(iChannel0,ivec2(4),0).rgb+mod(vec3(i_uv.y*seed*.2,i_uv.y*seed*.3,i_uv.y*seed*.5),vec3(2.))-1.;
    else
    	d = texelFetch(iChannel0,ivec2(4),0).rgb;
    
    
    if(f_uv.x>textBorder){
        
        //print color palette
        

        float t = (f_uv.x-textBorder)/(1.-textBorder);

        col = palette(t,a,b,c,d);
        
        // shadowing
        col *= 1. + 0.05*log(4.0*f_uv.y*(1.0-f_uv.y));
        
        // dithering
        col += (5.0/255.0)*texture( iChannel2, fragCoord.xy/iChannelResolution[2].xy ).xyz;
        
        
      
    }else if(f_uv.x > waveBorder){
    
        //print a,b,c and d values as text
        
         U = ( f_uv - vec2(waveBorder-0.005,.7) ) * vec2(64.,5.);  low C(1)caps C(-6)  // "a:"
         U = ( f_uv - vec2(waveBorder+0.020,.7) ) * vec2(70.,5.);        
         col += pFloat(U, a.r).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         
         col += pFloat(U, a.g).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         col += pFloat(U, a.b).xxx;  
             
             
         U = ( f_uv - vec2(waveBorder-0.005,.5) ) * vec2(64.,5.);  low C(2)caps C(-6)  // "b:"
         U = ( f_uv - vec2(waveBorder+0.020,.5) ) * vec2(70.,5.);        
         col += pFloat(U, b.r).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         
         col += pFloat(U, b.g).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         col += pFloat(U, b.b).xxx;      
             
             
         U = ( f_uv - vec2(waveBorder-0.005,.3) ) * vec2(64.,5.);  low C(3)caps C(-6)  // "c:"
         U = ( f_uv - vec2(waveBorder+0.020,.3) ) * vec2(70.,5.);        
         col += pFloat(U, c.r).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         
         col += pFloat(U, c.g).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         col += pFloat(U, c.b).xxx;      
             
             
         U = ( f_uv - vec2(waveBorder-0.005,.1) ) * vec2(64.,5.);  low C(4)caps C(-6)  // "d:"
         U = ( f_uv - vec2(waveBorder+0.020,.1) ) * vec2(70.,5.);        
         col += pFloat(U, d.r).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         
         col += pFloat(U, d.g).xxx;  U.x -= 2.; caps C(-20) U.x-=0.5;
         col += pFloat(U, d.b).xxx;  
             
         col += draw_char().xxx;
    	
        
    }else{
    
        //plot palette waves on the left
        
        float thickness = 1.5/iResolution.y/waveBorder;
        
        
        float t = (f_uv.x)/(waveBorder);
        
        col = palette(t,a,b,c,d);
        
        col = smoothstep(col-thickness, col ,vec3(f_uv.y)) - smoothstep(col, col +thickness,vec3(f_uv.y));
        
        //add grey background
        col = mix(vec3(0.1),col,col);
        
        
        
        
    }
    
    if(step(0.015, f_uv.y) == 0.)
        col = vec3(0.2);
    
    //print to screen
    fragColor = vec4(col,1.0);
}








/**** BUFFER A CODE BEGIN ****/

/*SHADERTOY INFO:
iChannel0: Keyboard Input
iChannel1: BufferA
*/


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    vec2 m = iMouse.xy/iResolution.xy;
    
    m.x = (max(m.x-textBorder,0.))/(1.-textBorder);
        
    vec3 oldA;
    vec3 oldB;
    vec3 oldC;
    vec3 oldD;
    
    
    if(iFrame==0){ 
        oldA = vec3(0.5);
        oldB = vec3(0.5);
        oldC = vec3(1.);
        oldD = vec3(0.5);
    }else{
    	oldA=texelFetch(iChannel1,ivec2(1),0).rgb;
    	oldB=texelFetch(iChannel1,ivec2(2),0).rgb;
        oldC=texelFetch(iChannel1,ivec2(3),0).rgb;
    	oldD=texelFetch(iChannel1,ivec2(4),0).rgb;
    }
    
    
    vec3 inpAB=vec3(0.);
    vec3 inpCD=vec3(0.);
    inpAB.r = texelFetch(iChannel0, ivec2(KEY_abR, 0), 0).x;
    inpAB.g = texelFetch(iChannel0, ivec2(KEY_abG, 0), 0).x;
    inpAB.b = texelFetch(iChannel0, ivec2(KEY_abB, 0), 0).x;
    
    inpCD.r = texelFetch(iChannel0, ivec2(KEY_cdR, 0), 0).x;
    inpCD.g = texelFetch(iChannel0, ivec2(KEY_cdG, 0), 0).x;
    inpCD.b = texelFetch(iChannel0, ivec2(KEY_cdB, 0), 0).x;
    
    
    oldA.r = inpAB.r > 0.5 ? m.x : oldA.r;
    oldB.r = inpAB.r > 0.5 ? m.y : oldB.r;
    
    oldA.g = inpAB.g > 0.5 ? m.x : oldA.g;
    oldB.g = inpAB.g > 0.5 ? m.y : oldB.g;
    
    oldA.b = inpAB.b > 0.5 ? m.x : oldA.b;
    oldB.b = inpAB.b > 0.5 ? m.y : oldB.b;

    
    oldC.r = inpCD.r > 0.5 ? m.y*3. : oldC.r;
    oldD.r = inpCD.r > 0.5 ? m.x : oldD.r;
    
    oldC.g = inpCD.g > 0.5 ? m.y*3. : oldC.g;
    oldD.g = inpCD.g > 0.5 ? m.x : oldD.g;
    
    oldC.b = inpCD.b > 0.5 ? m.y*3. : oldC.b;
    oldD.b = inpCD.b > 0.5 ? m.x : oldD.b;
    
    
    if(fragCoord == vec2(1.5))
	    fragColor = vec4(oldA,1.0);
    
    else if(fragCoord == vec2(2.5))
        fragColor = vec4(oldB,1.0);
        
    else if(fragCoord == vec2(3.5))
        fragColor = vec4(oldC,1.0);
        
    else if(fragCoord == vec2(4.5))
        fragColor = vec4(oldD,1.0);
    
        
    //store currentresolution (to check if entered or exited fullscreen)
    //not in use at the moment
    if (fragCoord == vec2(5.5) )
        fragColor.xy =  iResolution.xy;
        

}

/**** BUFFER A CODE END ****/

/**** COMMON CODE BEGIN ****/

#define PI 3.14159265
#define TAU 6.28318531


#define KEY_abR 82  /*R*/
#define KEY_abG 71  /*G*/
#define KEY_abB 66  /*B*/

#define KEY_cdR 84  /*T*/
#define KEY_cdG 72  /*H*/
#define KEY_cdB 78  /*N*/


float waveBorder = 0.15;
float textBorder = 0.3;

/**** COMMON CODE END ****/
