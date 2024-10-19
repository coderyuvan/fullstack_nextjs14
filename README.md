# Lecture 2( Learning ZOD)

mongoose ORM to talk with mongodb 
typescript m interface bnaya h in usermodel for type saftey Check the syntax
message or user schema ek hi file m define kr dia h

new folder Schemas
isme signup login jitne bhi operations performed ho rhe h sbke schemas honge bcoz mongoose sirf pure user schema ko check krega bt hr ek individual schema ko validatre krega
ZOD use krenge

# Lecture 3(connecting database)
nextjs edge time framework h jaise need pdti h tb execute hota not ki ek baar sever run hua to chlta rhega

in nextjs hr api m databse connect krna h or database connect k code m likhna h ki agr phle se connection established h to use that else make a new connection

# Lecture 4(Setup Resend email with NextJS)
flow for siugnup
if existinguserby email exsist then
 if it is verified sucess :false
 else save the updated user
else 
create new user

email folder for creating emial template
helpers for sending email

# Lecture 5(Signup user and custom OTP in NextJS)
flow for siugnup
if existinguserby email exsist then
 if it is verified sucess :false
 else save the updated user
else 
create new user

# Lecture 6(NEXT AUTH)
how to access credentials.identifier.username like this
options m for signin

# first give provider then callback then pages then startegy(kis basis p login de rha hu)
pages:"/sign-in" page design bhi ni krna pdega next auth kr lega
callbacks m jwt or seesion hi modified honge

tokens and session k ander maximum data daaldo taaki jb jo access krna hm kr ske it will cause payload size but will reduce database calls

for testing 
src/app/(auth)/sign-in/page.tsx this for  grouping not counted in route only for signin signup veirfy
created context folder for authprovider

# Summary of NEXTAUTH
2 cheezo ki knowledge chaiye providers and callbacks
src/app/api/auth/[...nexthauth]/option.tsandroute.ts ---> folder structure
providers m creadentials die h to authorize ki strategy bhi hamari khudki hogi 
github vgera se login hota to next auth krdeta
then cll backs ko modify kra for reducing db calls tokens session m saara data daala h
middleware run krna pdega bcoz nextauth usi p run hota h

sign-in k page k lie (auth) naam ka bundle bnaya isme saare auth wale frontend p pages rkhe 
then wrapper k lie context bnaya

# Lecture 7(OTP verification and unique username check in Nextjs)
created another route in api unique-username for functionality ki username available h ya nhi and in route.ts
zod se checking krenge to username schema import krna hoga 
and zod ek query schema dega

sample url for unique username
http://localhost:3000/api/cuu?username=hitesh

then second route created verify-code route