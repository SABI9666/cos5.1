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
 
BrowserRouter
 
as
 
Router
,
 
Routes
,
 
Route
 
}
 
from
 
'react-router-dom'
;

import
 
HomePage
 
from
 
'./pages/homepage.jsx'
;

import
 
ProductsPage
 
from
 
'./pages/productspage.jsx'
;

import
 
ProductDetail
 
from
 
'./pages/productdetail.jsx'
;

import
 
AdminPanel
 
from
 
'./pages/adminpanel.jsx'
;

import
 
Cart
 
from
 
'./components/cart.jsx'
;

import
 
'./app.css'
;

function
 
App
(
)
 
{

  
const
 
[
cartItems
,
 setCartItems
]
 
=
 
useState
(
function
(
)
 
{

    
var
 savedCart 
=
 
localStorage
.
getItem
(
'luxeled-cart'
)
;

    
return
 savedCart 
?
 
JSON
.
parse
(
savedCart
)
 
:
 
[
]
;

  
}
)
;

  
const
 
[
isCartOpen
,
 setIsCartOpen
]
 
=
 
useState
(
false
)
;

  
const
 
[
cartNotification
,
 setCartNotification
]
 
=
 
useState
(
''
)
;

  
useEffect
(
function
(
)
 
{

    
localStorage
.
setItem
(
'luxeled-cart'
,
 
JSON
.
stringify
(
cartItems
)
)
;

  
}
,
 
[
cartItems
]
)
;

  
useEffect
(
function
(
)
 
{

    
if
 
(
isCartOpen
)
 
{

      
document
.
body
.
style
.
overflow
 
=
 
'hidden'
;

    
}
 
else
 
{

      
document
.
body
.
style
.
overflow
 
=
 
'unset'
;

    
}

    
return
 
function
(
)
 
{

      
document
.
body
.
style
.
overflow
 
=
 
'unset'
;

    
}
;

  
}
,
 
[
isCartOpen
]
)
;

  
function
 
addToCart
(
product
)
 
{

    
var
 cartProduct 
=
 
{

      
id
:
 product
.
id
,

      
name
:
 product
.
name
,

      
price
:
 product
.
price
,

      
imageUrl
:
 product
.
imageUrl
 
||
 
'https://via.placeholder.com/100'
,

      
category
:
 product
.
category

    
}
;

    
setCartItems
(
function
(
prevItems
)
 
{

      
var
 existingItem 
=
 prevItems
.
find
(
function
(
item
)
 
{
 
return
 item
.
id
 
===
 cartProduct
.
id
;
 
}
)
;

      
if
 
(
existingItem
)
 
{

        
return
 prevItems
.
map
(
function
(
item
)
 
{

          
return
 item
.
id
 
===
 cartProduct
.
id
 
?
 
{
 
...
item
,
 
quantity
:
 item
.
quantity
 
+
 
1
 
}
 
:
 item
;

        
}
)
;

      
}
 
else
 
{

        
return
 
[
...
prevItems
,
 
{
 
...
cartProduct
,
 
quantity
:
 
1
 
}
]
;

      
}

    
}
)
;

    
setCartNotification
(
product
.
name
 
+
 
' added to cart!'
)
;

    
setTimeout
(
function
(
)
 
{
 
setCartNotification
(
''
)
;
 
}
,
 
2000
)
;

    
setIsCartOpen
(
true
)
;

  
}

  
function
 
removeFromCart
(
productId
)
 
{

    
setCartItems
(
function
(
prevItems
)
 
{

      
return
 prevItems
.
filter
(
function
(
item
)
 
{
 
return
 item
.
id
 
!==
 productId
;
 
}
)
;

    
}
)
;

  
}

  
function
 
updateQuantity
(
productId
,
 quantity
)
 
{

    
if
 
(
quantity 
===
 
0
)
 
{

      
removeFromCart
(
productId
)
;

    
}
 
else
 
{

      
setCartItems
(
function
(
prevItems
)
 
{

        
return
 prevItems
.
map
(
function
(
item
)
 
{

          
return
 item
.
id
 
===
 productId 
?
 
{
 
...
item
,
 
quantity
:
 quantity 
}
 
:
 item
;

        
}
)
;

      
}
)
;

    
}

  
}

  
function
 
clearCart
(
)
 
{

    
setCartItems
(
[
]
)
;

  
}

  
var
 cartCount 
=
 cartItems
.
reduce
(
function
(
total
,
 item
)
 
{
 
return
 total 
+
 item
.
quantity
;
 
}
,
 
0
)
;

  
function
 
openCart
(
)
 
{
 
setIsCartOpen
(
true
)
;
 
}

  
function
 
closeCart
(
)
 
{
 
setIsCartOpen
(
false
)
;
 
}

  
return
 
(

    
<
Router
>

      
<
div
 
className
=
"
App
"
>

        
{
cartNotification 
&&
 
(

          
<
div
 
className
=
"
cart-notification
"
>

            
<
svg
 
width
=
"
20
"
 
height
=
"
20
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

            
{
cartNotification
}

          
</
div
>

        
)
}

        
<
Cart
 
items
=
{
cartItems
}
 
isOpen
=
{
isCartOpen
}
 
onClose
=
{
closeCart
}
 
updateQuantity
=
{
updateQuantity
}
 
removeFromCart
=
{
removeFromCart
}
 
clearCart
=
{
clearCart
}
 
/>

        
<
Routes
>

          
<
Route
 
path
=
"
/
"
 
element
=
{
<
HomePage
 
onCartClick
=
{
openCart
}
 
cartCount
=
{
cartCount
}
 
addToCart
=
{
addToCart
}
 
/>
}
 
/>

          
<
Route
 
path
=
"
/products
"
 
element
=
{
<
ProductsPage
 
addToCart
=
{
addToCart
}
 
onCartClick
=
{
openCart
}
 
cartCount
=
{
cartCount
}
 
/>
}
 
/>

          
<
Route
 
path
=
"
/product/:id
"
 
element
=
{
<
ProductDetail
 
addToCart
=
{
addToCart
}
 
onCartClick
=
{
openCart
}
 
cartCount
=
{
cartCount
}
 
/>
}
 
/>

          
<
Route
 
path
=
"
/admin
"
 
element
=
{
<
AdminPanel
 
/>
}
 
/>

        
</
Routes
>

      
</
div
>

    
</
Router
>

  
)
;

}

export
 
default
 
App
;

