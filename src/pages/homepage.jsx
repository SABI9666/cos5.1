import
 
React
,
 
{
 useState
,
 useEffect 
}
 
from
 
'react'
;

import
 
{
 
Link
 
}
 
from
 
'react-router-dom'
;

import
 
Navbar
 
from
 
'../components/navbar.jsx'
;

import
 
Footer
 
from
 
'../components/footer.jsx'
;

import
 
{
 getProducts 
}
 
from
 
'../services/api'
;

import
 
'./homepage.css'
;

const
 
HomePage
 
=
 
(
{
 onCartClick
,
 cartCount 
}
)
 
=>
 
{

  
const
 
[
featuredProducts
,
 setFeaturedProducts
]
 
=
 
useState
(
[
]
)
;

  
const
 
[
loading
,
 setLoading
]
 
=
 
useState
(
true
)
;

  
useEffect
(
(
)
 
=>
 
{

    
loadFeaturedProducts
(
)
;

  
}
,
 
[
]
)
;

  
const
 
loadFeaturedProducts
 
=
 
async
 
(
)
 
=>
 
{

    
try
 
{

      
const
 products 
=
 
await
 
getProducts
(
)
;

      
setFeaturedProducts
(
products
.
slice
(
0
,
 
4
)
)
;

      
setLoading
(
false
)
;

    
}
 
catch
 
(
error
)
 
{

      
console
.
error
(
'Error loading products:'
,
 error
)
;

      
setLoading
(
false
)
;

    
}

  
}
;

  
const
 categories 
=
 
[

    
{

      
name
:
 
'LED Strip Lights'
,

      
description
:
 
'Flexible RGB lighting solutions'
,

      
image
:
 
'https://images.unsplash.com/photo-1600375739037-ae4f0b32e340?w=800'
,

      
link
:
 
'/products?category=strip'

    
}
,

    
{

      
name
:
 
'Smart Bulbs'
,

      
description
:
 
'WiFi-enabled color-changing bulbs'
,

      
image
:
 
'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800'
,

      
link
:
 
'/products?category=bulbs'

    
}
,

    
{

      
name
:
 
'Panel Lights'
,

      
description
:
 
'Modern ceiling & wall panels'
,

      
image
:
 
'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800'
,

      
link
:
 
'/products?category=panels'

    
}
,

    
{

      
name
:
 
'Outdoor Lighting'
,

      
description
:
 
'Weather-resistant LED solutions'
,

      
image
:
 
'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800'
,

      
link
:
 
'/products?category=outdoor'

    
}

  
]
;

  
return
 
(

    
<
div
 
className
=
"
home-page
"
>

      
<
Navbar
 
onCartClick
=
{
onCartClick
}
 
cartCount
=
{
cartCount
}
 
/>

      
{
/* Hero Section */
}

      
<
section
 
className
=
"
hero-section
"
>

        
<
div
 
className
=
"
hero-background-container
"
>

          
<
img
 
            
src
=
"
https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920
"
 
            
alt
=
"
LED Lights Hero
"
 
            
className
=
"
hero-background
"

          
/>

        
</
div
>

        
<
div
 
className
=
"
hero-overlay
"
>
</
div
>

        
<
div
 
className
=
"
hero-content
"
>

          
<
h1
 
className
=
"
hero-title
"
>

            Illuminate Your 
<
span
 
className
=
"
highlight
"
>
World
</
span
>

          
</
h1
>

          
<
p
 
className
=
"
hero-subtitle
"
>

            Premium LED lighting solutions for modern living spaces
          
</
p
>

          
<
Link
 
to
=
"
/products
"
 
className
=
"
cta-button
"
>

            Explore Collection
          
</
Link
>

        
</
div
>

      
</
section
>

      
{
/* Categories Section */
}

      
<
section
 
className
=
"
section
"
>

        
<
h2
 
className
=
"
section-title
"
>
Shop by Category
</
h2
>

        
<
p
 
className
=
"
section-subtitle
"
>

          Discover the perfect lighting solution for every space
        
</
p
>

        
<
div
 
className
=
"
category-grid
"
>

          
{
categories
.
map
(
(
category
,
 index
)
 
=>
 
(

            
<
Link
 
              
to
=
{
category
.
link
}
 
              
key
=
{
index
}
 
              
className
=
"
category-card
"

              
style
=
{
{
 
animationDelay
:
 
`
${
index 
*
 
0.1
}
s
`
 
}
}

            
>

              
<
img
 
src
=
{
category
.
image
}
 
alt
=
{
category
.
name
}
 
className
=
"
category-image
"
 
/>

              
<
div
 
className
=
"
category-info
"
>

                
<
h3
 
className
=
"
category-name
"
>
{
category
.
name
}
</
h3
>

                
<
p
 
className
=
"
category-description
"
>
{
category
.
description
}
</
p
>

                
<
span
 
className
=
"
shop-link
"
>

                  Shop Now 
                  
<
svg
 
width
=
"
16
"
 
height
=
"
16
"
 
viewBox
=
"
0 0 16 16
"
 
fill
=
"
none
"
>

                    
<
path
 
d
=
"
M6 12L10 8L6 4
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
 
strokeLinecap
=
"
round
"
 
strokeLinejoin
=
"
round
"
/>

                  
</
svg
>

                
</
span
>

              
</
div
>

            
</
Link
>

          
)
)
}

        
</
div
>

      
</
section
>

      
{
/* Featured Products */
}

      
<
section
 
className
=
"
section featured-section
"
>

        
<
h2
 
className
=
"
section-title
"
>
Featured Products
</
h2
>

        
<
p
 
className
=
"
section-subtitle
"
>

          Handpicked premium LED solutions for exceptional performance
        
</
p
>

        
{
loading 
?
 
(

          
<
div
 
className
=
"
loading-container
"
>

            
<
div
 
className
=
"
loading-spinner
"
>
</
div
>

          
</
div
>

        
)
 
:
 
(

          
<
div
 
className
=
"
product-grid
"
>

            
{
featuredProducts
.
map
(
(
product
,
 index
)
 
=>
 
(

              
<
div
 
                
key
=
{
product
.
id
}
 
                
className
=
"
product-card
"

                
style
=
{
{
 
animationDelay
:
 
`
${
index 
*
 
0.1
}
s
`
 
}
}

              
>

                
<
div
 
className
=
"
product-image-container
"
>

                  
<
img
 
                    
src
=
{
product
.
imageUrl
 
||
 
'https://via.placeholder.com/400'
}
 
                    
alt
=
{
product
.
name
}
 
                    
className
=
"
product-image
"

                  
/>

                  
{
product
.
badge
 
&&
 
(

                    
<
span
 
className
=
"
product-badge
"
>
{
product
.
badge
}
</
span
>

                  
)
}

                
</
div
>

                
<
div
 
className
=
"
product-info
"
>

                  
<
span
 
className
=
"
product-category
"
>
{
product
.
category
}
</
span
>

                  
<
h3
 
className
=
"
product-name
"
>
{
product
.
name
}
</
h3
>

                  
<
p
 
className
=
"
product-description
"
>

                    
{
product
.
description
}

                  
</
p
>

                  
<
div
 
className
=
"
product-footer
"
>

                    
<
span
 
className
=
"
product-price
"
>
&#8377;
{
product
.
price
}
</
span
>

                    
<
Link
 
to
=
{
`
/product/
${
product
.
id
}
`
}
 
className
=
"
view-details-btn
"
>

                      View Details
                    
</
Link
>

                  
</
div
>

                
</
div
>

              
</
div
>

            
)
)
}

          
</
div
>

        
)
}

        
<
div
 
className
=
"
view-all-container
"
>

          
<
Link
 
to
=
"
/products
"
 
className
=
"
view-all-btn
"
>

            View All Products
          
</
Link
>

        
</
div
>

      
</
section
>

      
{
/* Features Section */
}

      
<
section
 
className
=
"
section features-section
"
>

        
<
div
 
className
=
"
features-grid
"
>

          
<
div
 
className
=
"
feature-card
"
>

            
<
div
 
className
=
"
feature-icon
"
>

              
<
svg
 
width
=
"
48
"
 
height
=
"
48
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
>

                
<
path
 
d
=
"
M13 2L3 14h8l-1 8 10-12h-8l1-8z
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
 
strokeLinecap
=
"
round
"
 
strokeLinejoin
=
"
round
"
/>

              
</
svg
>

            
</
div
>

            
<
h3
>
Energy Efficient
</
h3
>

            
<
p
>
Save up to 80% on energy costs with our LED technology
</
p
>

          
</
div
>

          
<
div
 
className
=
"
feature-card
"
>

            
<
div
 
className
=
"
feature-icon
"
>

              
<
svg
 
width
=
"
48
"
 
height
=
"
48
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
>

                
<
path
 
d
=
"
M12 2v20M2 12h20
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
 
strokeLinecap
=
"
round
"
/>

                
<
circle
 
cx
=
"
12
"
 
cy
=
"
12
"
 
r
=
"
9
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
/>

              
</
svg
>

            
</
div
>

            
<
h3
>
Smart Control
</
h3
>

            
<
p
>
WiFi-enabled control via smartphone or voice assistants
</
p
>

          
</
div
>

          
<
div
 
className
=
"
feature-card
"
>

            
<
div
 
className
=
"
feature-icon
"
>

              
<
svg
 
width
=
"
48
"
 
height
=
"
48
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
>

                
<
circle
 
cx
=
"
12
"
 
cy
=
"
12
"
 
r
=
"
10
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
/>

                
<
path
 
d
=
"
M8 12h8M12 8v8
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
 
strokeLinecap
=
"
round
"
/>

              
</
svg
>

            
</
div
>

            
<
h3
>
Long Lifespan
</
h3
>

            
<
p
>
Rated for 50,000+ hours of reliable operation
</
p
>

          
</
div
>

          
<
div
 
className
=
"
feature-card
"
>

            
<
div
 
className
=
"
feature-icon
"
>

              
<
svg
 
width
=
"
48
"
 
height
=
"
48
"
 
viewBox
=
"
0 0 24 24
"
 
fill
=
"
none
"
>

                
<
path
 
d
=
"
M20 6L9 17l-5-5
"
 
stroke
=
"
currentColor
"
 
strokeWidth
=
"
2
"
 
strokeLinecap
=
"
round
"
 
strokeLinejoin
=
"
round
"
/>

              
</
svg
>

            
</
div
>

            
<
h3
>
Quality Assured
</
h3
>

            
<
p
>
2-year warranty on all premium LED products
</
p
>

          
</
div
>

        
</
div
>

      
</
section
>

      
<
Footer
 
/>

    
</
div
>

  
)
;

}
;

export
 
default
 
HomePage
;
