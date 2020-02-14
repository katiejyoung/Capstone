brutePass.sh
	BrutePass takes advantage of the PUT login to test username and password combos
	Usernames are provided by the script user
	Passwords are taken from passwords.txt which has the 10000 top passwords

Directions to use brutePass.sh:
	Place brutePass.sh and passwords.txt in the same directory
	Open a connection to osu servers (do not use flip3, or the same server as the site is hosted if not flip3)
	Open the directory with brutePass.sh
	You may need to give yourself permission to run the script:
		chmod 777 brutePass.sh

To use the script:
	./brutePass.sh -g username URL

Examples:
	./brutePass.sh -g Kyle flip3.engr.oregonstate.edu:6061
	./brutePass.sh -g Katie flip3.engr.oregonstate.edu:6061
	./brutePass.sh -g Admin flip3.engr.oregonstate.edu:6061

