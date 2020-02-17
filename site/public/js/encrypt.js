//Source: https://www.sitepoint.com/how-to-build-a-cipher-machine-with-javascript/
//Includes encrypt and decrypt functions
//Performs basic shift encryption, different shifts are used for different char types

//Randomize arrays to add complexity or Create multiple different versions
const alphabetUp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const alphabetLow = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const special = ['@', '#', '$', '%', '<', '^', '>', '?'];       //Not all special characters are included, add more after input sterilization / password criteria established
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

//https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}

//Takes a passed character and performs a shift
function encrypt(char) {
  const shift1 = 5;      //These values can be changed to have different shift values
  const shift2 = 4;      
  const shift3 = 6;      
  const shift4 = 3;      

  if (alphabetUp.includes(char))
  { 
      const position1 = alphabetUp.indexOf(char);      //Get position in of the original char
      const newPosition1 = (position1 + shift1)%26;                  //Perform the shift
      return alphabetUp[newPosition1]                                //return the new character
  }
  else if (alphabetLow.includes(char))
  { 
      const position2 = alphabetLow.indexOf(char);     
      const newPosition2 = (position2 + shift2)%26;               
      return alphabetLow[newPosition2]                             
  }
  else if (special.includes(char))
  { 
      const position3 = special.indexOf(char);      
      const newPosition3 = (position3 + shift3)%8;               
      return special[newPosition3]                               
  }
  else if (numbers.includes(char))
  { 
      const position4 = numbers.indexOf(char);    
      const newPosition4 = (position4 + shift4)%10;        
      return numbers[newPosition4]                              
  }
  else { return char }  
}


//Takes a passed character and performs a shift (back to the original char)
function decrypt(char) {
    const shift1 = 5;      //This value can be changed to have different shift values
    const shift2 = 4;      //This value can be changed to have different shift values
    const shift3 = 6;      //This value can be changed to have different shift values
    const shift4 = 3;      //This value can be changed to have different shift values

    if (alphabetUp.includes(char))
    { 
      const position1 = alphabetUp.indexOf(char);      //Get position in of the original char
      const newPosition1 = (position1 - shift1).mod(26);                  //Perform the shift
      return alphabetUp[newPosition1]                                //return the new character
    }
    else if (alphabetLow.includes(char))
    { 
      const position2 = alphabetLow.indexOf(char);     
      const newPosition2 = (position2 - shift2).mod(26);              
      return alphabetLow[newPosition2]                               
    }
    else if (special.includes(char))
    { 
        const position3 = special.indexOf(char);     
        const newPosition3 = (position3 - shift3).mod(8);                
        return special[newPosition3]                                
    }
    else if (numbers.includes(char))
    { 
        const position4 = numbers.indexOf(char);      
        const newPosition4 = (position4 - shift4).mod(10);                  
        return numbers[newPosition4]                                
    }
    else { return char }  
}

//Get Character Function
  //Uses random number to pick a character from letter arrays
function getChar() {
  var value;
    switch (Math.floor(Math.random()*2)) {
    case 0:
      value =  alphabetUp[Math.floor(Math.random()*26)];
      break;
    case 1:
      value =  alphabetLow[Math.floor(Math.random()*26)];
    }
    return value;
}

//Get Values Function
  //Creates and returns an array of values based on passed in number
function getValues(numKey) {
  var values =[];
  values[0] = Math.floor((( (numKey*3) /6) %4) +1);
  values[1] = Math.floor((( (numKey*5) /2) %4) +1);
  values[2] = Math.floor((( (numKey/7) *3) %3) +2);
  values[3] = Math.floor((( (numKey/8) *9) %3) +6);
  values[4] = Math.floor((( (numKey*3) *6) %3) +2);
  values[5] = Math.floor((( (numKey*5) *2) %4) +6);
  values[6] = Math.floor((( (numKey/7) /5) %3) +2);
  values[7] = Math.floor((( (numKey/8) /5) %3) +6);
  return values;
}

//Hide Key Function
  //Creates and returns a string of letters based on the passed in number
function hideKey(numKey) {
  var keyConv = [];
  var i;
  for (i=0; i<5; i++) {
    const pos = numbers.indexOf(String(numKey).charAt(i));
    switch (Math.floor(Math.random()*2)) {    //Using the index value makes the case only superficial
      case 0:
        keyConv[i] = alphabetUp[pos];
        break;
      case 1:
        keyConv[i] = alphabetLow[pos];
      }
  }
  return keyConv;
}

//Reveal Key Function
  //Creates and returns a number based on the passed in string
function revealKey(charKey) {
  var keyConv = [];
  var i;
  charKey = charKey.toUpperCase();         //Using the index value makes the case only superficial
  for (i=0; i<5; i++) {
    const pos = alphabetUp.indexOf(String(charKey).charAt(i));
    keyConv[i] = numbers[pos];
  }
  return keyConv;
}

//Add Mask Function
  //Encrypts passed in array of characters
  //Creates number key and adds additional characters to the encrypted array
  //Masks number key and attaches to encrypted array
  //returns encrypted array as string
function addMask(line) {
  line = line.map(line => encrypt(line));   //encrypt
  var middle = line;
  var numKey = Math.floor(Math.random() * 90000) + 10000; //Generate 5 digit key
  var keyValues = getValues(numKey);    //Generate values based on key
  var i;
  for (i=0; i<keyValues[0];i++) {   //Add characters based on values
      middle.push(getChar());
  }
  for (i=0; i<keyValues[1];i++) {
      middle.unshift(getChar());
  }
  var str = middle.join('');
  for (i = 0; i < str.length; i++) {
    middle[i]=(str.charAt(i));
  }
  for (i=0; i<keyValues[2];i++) {
    middle.splice(keyValues[3],0,getChar());
  }
  for (i=0; i<keyValues[4];i++) {
    middle.splice(keyValues[5],0,getChar());
  }
  for (i=0; i<keyValues[6];i++) {
    middle.splice(keyValues[7],0,getChar());
  }
  var maskKey = hideKey(numKey);  //Mask the key
  maskKey = maskKey.join('');
  middle.unshift(maskKey);    //Add the masked key
  line = middle.join('');
  return line;
}

//Remove Mask Function
  //Gets and unmasks number key from passed in encrypted array of characters
  //Removes additional characters from encrypted array using number key
  //Decrypts remaining encrypted array
  //Returns decrypted array as a string
function removeMask(line) {
  var middle = line;
  var maskKey = middle.slice(0,5);    //Get masked key
  maskKey = maskKey.join('');
  var numKey = revealKey(maskKey);    //Unmask key
  numKey = numKey.join('');
  var i;
  for (i=0; i<5;i++) {
      middle.shift();
  }
  var keyValues = getValues(numKey);  //Generate values based on key
  var str = middle.join('');
  for (i = 0; i < str.length; i++) {
    middle[i]=(str.charAt(i));
  }
  middle.splice(keyValues[7],keyValues[6]);   //Remove characters based on key
  middle.splice(keyValues[5],keyValues[4]);
  middle.splice(keyValues[3],keyValues[2]);
  for (i=0; i<keyValues[0];i++) {
      middle.pop();
  }
  for (i=0; i<keyValues[1];i++) {
      middle.shift();
  }
  middle = middle.map(middle => decrypt(middle));   //decrypt
  line = middle.join('');
  return line;
}
