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

Testing
**Examples:**
* ./brutePass.sh -g Kyle flip3.engr.oregonstate.edu:6061
* ./brutePass.sh -g Katie flip3.engr.oregonstate.edu:6061
* ./brutePass.sh -g Admin flip3.engr.oregonstate.edu:6061


### SQL Injection Attack
**HTML SQL Injection:**
* SQL code can be inserted into the URL as placeholders are not used for MySQL credential checks
* Use the following URL to access users' information without their credentials
```
http://flip3.engr.oregonstate.edu:6061/user/*%20OR%20ALL&*%20OR%20ALL
```

### HTML Injection Attack
**To inject a script:**
1. Sign into any existing user account
2. Add a new record, using the following as the value for one field in the form: 
```
>"&amp;gt;<script>alert("Warning: This site is vulnerable to an attack")</script>
```
3. Note the popup alert warning of possible attack


### Buffer Overflow Attack
**bufferExploit.sh**
* BufferExploit takes advantage of the buffer used on record names when inserting a new record
* A curl POST is sent with a number value, allocating empty space instead of saving a string value
* Overflow memory is then accessed on the user page as a new record with the name being the data

**Directions to use bufferExploit.sh:**
1. The data for the Kyle profile has been hardcoded into the attack code (the attacker needs a profile and their profile ID)
2. Run the script and access memory data at flip3.engr.oregonstate.edu:6061/user/Kyle&12345
3. Repeatly run the script to get chunks of memory to later decode and decipther

**To use the script:** ./bufferExploit.sh


### Denial of Service (DoS) Attack
**Fork Bomb:**
1. Make sure that the active internet browser will not block popups
2. Add a new record, using the following as the value for the record name:
*  Change URL to link to user profile in use
```
>"&amp;gt;<script>
function fork() {
  	const win = window.open("http://flip3.engr.oregonstate.edu:6061/user/Kyle&12345");
	setTimeout(fork(), 1);
}
fork(); </script>
```
3. Select the name of the record from the record table to intitate fork bomb
* **WARNING: This will slow down the user computer**
* This does not bring down the school server (thankfully) rather it illustrates how to slow down a weak server
* The Kyle account has this record already saved and ready to initiate 
