# Chattn.io

This project was idealized amidst searching about encryption (most predominantly Diffie–Hellman) , and how many applications currently use those technologies to protect data.

As the name suggests, Chattn.io is a simple Chat application, that uses sockets to create a simple interface so 2 users can talk and interact through text-messaging. To keep it 
simple,  protecting  the user's keys (and most security aspects of encryption) are not adressed in this project (although it is commented inside the code), so keep in mind that 
even though this project uses encryption to prevent any leaks while transmitting messages throught the socket, it is definitely not secure for a real-world application.

This project has 2 main "bases", NodeJS and Socket.io, Node acting as the server and host for the entire application and Socket.io  for all the communication interactions. 
Although not as pivotal as those 2, the application also depends heavily on PostreSQL (for the database - storing users, requests, etc.) and Crypto (for encryption and protection
of the messaging process).

Much like most projects on my GitHub, this project was made for personal growth and learning, meaning that most likely there are many unoptimized parts, so if you have any 
suggestions for the application or want to refactor certain parts of the code please do so, as this project's only goal is proportionate learning.
