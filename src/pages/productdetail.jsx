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
 useParams
,
 
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
 
'./productdetail.css'
;

const
 
ProductDetail
 
=
 
(
{
 addToCart
,
 onCartClick
,
 cartCount 
}
)
 
=>
 
{

  
const
 
{
 id 
}
 
=
 
useParams
(
)
;

  
const
 
[
product
,
 setProduct
]
 
=
 
useState
(
null
)
;

  
const
 
[
quantity
,
 setQuantity
]
 
=
 
useState
(
1
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

    
loadProduct
(
)
;

  
}
,
 
[
id
]
)
;

  
const
 
loadProduct
 
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

      
const
 foundProduct 
=
 products
.
find
(
p
 
=>
 p
.
id
 
===
 id
)
;

      
setProduct
(
foundProduct
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
'Error loading product:'
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
 
handleAddToCart
 
=
 
(
)
 
=>
 
{

    
for
 
(
let
 i 
=
 
0
;
 i 
<
 quantity
;
 i
++
)
 
{

      
addToCart
(
product
)
;

    
}

  
}
;

  
if
 
(
loading
)
 
{

    
return
 
(

      
<
div
 
className
=
"
product-detail-page
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

      
</
div
>

    
)
;

  
}

  
if
 
(
!
product
)
 
{

    
return
 
(

      
<
div
 
className
=
"
product-detail-page
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

        
<
div
 
className
=
"
not-found
"
>

          
<
h2
>
Product Not Found
</
h2
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
back-link
"
>
Back to Products
</
Link
>

        
</
div
>

      
</
div
>

    
)
;

  
}

  
return
 
(

    
<
div
 
className
=
"
product-detail-page
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

      
<
div
 
className
=
"
breadcrumb
"
>

        
<
Link
 
to
=
"
/
"
>
Home
</
Link
>

        
<
span
>
/
</
span
>

        
<
Link
 
to
=
"
/products
"
>
Products
</
Link
>

        
<
span
>
/
</
span
>

        
<
span
>
{
product
.
name
}
</
span
>

      
</
div
>

      
<
div
 
className
=
"
product-detail-container
"
>

        
<
div
 
className
=
"
product-image-section
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
 
'https://via.placeholder.com/800'
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
detail-image
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
product-info-section
"
>

          
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
detail-badge
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

          
<
h1
 
className
=
"
detail-title
"
>
{
product
.
name
}
</
h1
>

          
<
p
 
className
=
"
detail-category
"
>
{
product
.
category
}
</
p
>

          
<
div
 
className
=
"
detail-price
"
>
&#8377;
{
product
.
price
}
</
div
>

          
<
div
 
className
=
"
detail-description
"
>

            
<
h3
>
Description
</
h3
>

            
<
p
>
{
product
.
description
}
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
detail-specs
"
>

            
<
h3
>
Specifications
</
h3
>

            
<
ul
>

              
<
li
>
<
strong
>
Category:
</
strong
>
 
{
product
.
category
}
</
li
>

              
<
li
>
<
strong
>
Stock:
</
strong
>
 
{
product
.
quantity
}
 units available
</
li
>

              
<
li
>
<
strong
>
Warranty:
</
strong
>
 2 years
</
li
>

              
<
li
>
<
strong
>
Energy Rating:
</
strong
>
 A+
</
li
>

            
</
ul
>

          
</
div
>

          
<
div
 
className
=
"
detail-actions
"
>

            
<
div
 
className
=
"
quantity-selector
"
>

              
<
button
 
onClick
=
{
(
)
 
=>
 
setQuantity
(
Math
.
max
(
1
,
 quantity 
-
 
1
)
)
}
>
-
</
button
>

              
<
span
>
{
quantity
}
</
span
>

              
<
button
 
onClick
=
{
(
)
 
=>
 
setQuantity
(
Math
.
min
(
product
.
quantity
,
 quantity 
+
 
1
)
)
}
>
+
</
button
>

            
</
div
>

            
<
button
 
className
=
"
add-to-cart-large
"
 
onClick
=
{
handleAddToCart
}
>

              Add to Cart
            
</
button
>

          
</
div
>

          
<
div
 
className
=
"
detail-features
"
>

            
<
div
 
className
=
"
feature-item
"
>

              
<
svg
 
width
=
"
24
"
 
height
=
"
24
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
>

                
<
path
 
d
=
"
M20 6L9 17l-5-5
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

              
<
span
>
Free shipping on orders over &#8377;2000
</
span
>

            
</
div
>

            
<
div
 
className
=
"
feature-item
"
>

              
<
svg
 
width
=
"
24
"
 
height
=
"
24
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
>

                
<
path
 
d
=
"
M20 6L9 17l-5-5
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

              
<
span
>
30-day return policy
</
span
>

            
</
div
>

            
<
div
 
className
=
"
feature-item
"
>

              
<
svg
 
width
=
"
24
"
 
height
=
"
24
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
>

                
<
path
 
d
=
"
M20 6L9 17l-5-5
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

              
<
span
>
2-year manufacturer warranty
</
span
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

      
</
div
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
 
ProductDetail
;



















