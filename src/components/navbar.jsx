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
,
 useLocation 
}
 
from
 
'react-router-dom'
;

const
 
Navbar
 
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
scrolled
,
 setScrolled
]
 
=
 
useState
(
false
)
;

  
const
 
[
mobileMenuOpen
,
 setMobileMenuOpen
]
 
=
 
useState
(
false
)
;

  
const
 
location
 
=
 
useLocation
(
)
;

  
useEffect
(
(
)
 
=>
 
{

    
const
 
handleScroll
 
=
 
(
)
 
=>
 
{

      
setScrolled
(
window
.
scrollY
 
>
 
50
)
;

    
}
;

    
window
.
addEventListener
(
'scroll'
,
 handleScroll
)
;

    
return
 
(
)
 
=>
 
window
.
removeEventListener
(
'scroll'
,
 handleScroll
)
;

  
}
,
 
[
]
)
;

  
// Close mobile menu on route change

  
useEffect
(
(
)
 
=>
 
{

    
setMobileMenuOpen
(
false
)
;

  
}
,
 
[
location
]
)
;

  
// Prevent body scroll when mobile menu is open

  
useEffect
(
(
)
 
=>
 
{

    
if
 
(
mobileMenuOpen
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
 
(
)
 
=>
 
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
mobileMenuOpen
]
)
;

  
const
 
toggleMobileMenu
 
=
 
(
)
 
=>
 
{

    
setMobileMenuOpen
(
!
mobileMenuOpen
)
;

  
}
;

  
return
 
(

    
<
>

      
<
nav
 
className
=
{
`
navbar 
${
scrolled 
?
 
'scrolled'
 
:
 
''
}
`
}
>

        
<
div
 
className
=
"
navbar-container
"
>

          
<
Link
 
to
=
"
/
"
 
className
=
"
logo
"
>

            LUXELED
          
</
Link
>

          
{
/* Desktop Navigation */
}

          
<
ul
 
className
=
"
nav-links desktop-nav
"
>

            
<
li
>

              
<
Link
 
to
=
"
/
"
 
className
=
{
location
.
pathname
 
===
 
'/'
 
?
 
'active'
 
:
 
''
}
>

                Home
              
</
Link
>

            
</
li
>

            
<
li
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
{
location
.
pathname
 
===
 
'/products'
 
?
 
'active'
 
:
 
''
}
>

                Products
              
</
Link
>

            
</
li
>

            
<
li
>

              
<
Link
 
to
=
"
/admin
"
 
className
=
{
location
.
pathname
 
===
 
'/admin'
 
?
 
'active'
 
:
 
''
}
>

                Admin
              
</
Link
>

            
</
li
>

            
<
li
 
className
=
"
cart-icon
"
 
onClick
=
{
onCartClick
}
>

              
<
svg
 
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
M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z
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

                
<
path
 
d
=
"
M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6
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
cartCount 
>
 
0
 
&&
 
<
span
 
className
=
"
cart-count
"
>
{
cartCount
}
</
span
>
}

            
</
li
>

          
</
ul
>

          
{
/* Mobile Controls */
}

          
<
div
 
className
=
"
mobile-controls
"
>

            
<
div
 
className
=
"
cart-icon mobile-cart
"
 
onClick
=
{
onCartClick
}
>

              
<
svg
 
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
M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z
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

                
<
path
 
d
=
"
M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6
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
cartCount 
>
 
0
 
&&
 
<
span
 
className
=
"
cart-count
"
>
{
cartCount
}
</
span
>
}

            
</
div
>

            
<
button
 
              
className
=
{
`
hamburger 
${
mobileMenuOpen 
?
 
'active'
 
:
 
''
}
`
}

              
onClick
=
{
toggleMobileMenu
}

              
aria-label
=
"
Toggle menu
"

            
>

              
<
span
 
className
=
"
hamburger-line
"
>
</
span
>

              
<
span
 
className
=
"
hamburger-line
"
>
</
span
>

              
<
span
 
className
=
"
hamburger-line
"
>
</
span
>

            
</
button
>

          
</
div
>

        
</
div
>

      
</
nav
>

      
{
/* Mobile Menu Overlay */
}

      
{
mobileMenuOpen 
&&
 
(

        
<
div
 
className
=
"
mobile-menu-overlay
"
 
onClick
=
{
(
)
 
=>
 
setMobileMenuOpen
(
false
)
}
>
</
div
>

      
)
}

      
{
/* Mobile Menu Drawer */
}

      
<
div
 
className
=
{
`
mobile-menu 
${
mobileMenuOpen 
?
 
'open'
 
:
 
''
}
`
}
>

        
<
div
 
className
=
"
mobile-menu-header
"
>

          
<
span
 
className
=
"
mobile-menu-title
"
>
Menu
</
span
>

          
<
button
 
className
=
"
mobile-menu-close
"
 
onClick
=
{
(
)
 
=>
 
setMobileMenuOpen
(
false
)
}
>

            &times;
          
</
button
>

        
</
div
>

        
<
ul
 
className
=
"
mobile-nav-links
"
>

          
<
li
>

            
<
Link
 
to
=
"
/
"
 
className
=
{
location
.
pathname
 
===
 
'/'
 
?
 
'active'
 
:
 
''
}
>

              
<
svg
 
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
>

                
<
path
 
d
=
"
M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z
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

                
<
polyline
 
points
=
"
9 22 9 12 15 12 15 22
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

              Home
            
</
Link
>

          
</
li
>

          
<
li
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
{
location
.
pathname
 
===
 
'/products'
 
?
 
'active'
 
:
 
''
}
>

              
<
svg
 
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
>

                
<
rect
 
x
=
"
3
"
 
y
=
"
3
"
 
width
=
"
7
"
 
height
=
"
7
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

                
<
rect
 
x
=
"
14
"
 
y
=
"
3
"
 
width
=
"
7
"
 
height
=
"
7
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

                
<
rect
 
x
=
"
14
"
 
y
=
"
14
"
 
width
=
"
7
"
 
height
=
"
7
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

                
<
rect
 
x
=
"
3
"
 
y
=
"
14
"
 
width
=
"
7
"
 
height
=
"
7
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

              Products
            
</
Link
>

          
</
li
>

          
<
li
>

            
<
Link
 
to
=
"
/admin
"
 
className
=
{
location
.
pathname
 
===
 
'/admin'
 
?
 
'active'
 
:
 
''
}
>

              
<
svg
 
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
3
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

                
<
path
 
d
=
"
M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z
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

              Admin Panel
            
</
Link
>

          
</
li
>

        
</
ul
>

        
<
div
 
className
=
"
mobile-menu-footer
"
>

          
<
button
 
className
=
"
mobile-cart-btn
"
 
onClick
=
{
(
)
 
=>
 
{
 
setMobileMenuOpen
(
false
)
;
 
onCartClick
(
)
;
 
}
}
>

            
<
svg
 
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
>

              
<
path
 
d
=
"
M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z
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

              
<
path
 
d
=
"
M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6
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

            View Cart
            
{
cartCount 
>
 
0
 
&&
 
<
span
 
className
=
"
mobile-cart-count
"
>
(
{
cartCount
}
)
</
span
>
}

          
</
button
>

        
</
div
>

      
</
div
>

    
</
>

  
)
;

}
;

export
 
default
 
Navbar
;

