//Source: https://www.sitepoint.com/how-to-build-a-cipher-machine-with-javascript/
//Includes encrypt and decrypt functions
//Performs basic shift encryption, different shifts are used for different char types
//Export for Server Use (secretKeeper.js)

//Randomize arrays to add complexity or Create multiple different versions
var alphabetUp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var alphabetLow = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
var special = ['@', '#', '$', '%', '<', '^', '>', '?'];       //Not all special characters are included, add more after input sterilization / password criteria established
var numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

//https://web.archive.org/web/20090717035140if_/javascript.about.com/od/problemsolving/a/modulobug.htm
Number.prototype.mod = function(n) {
  return ((this%n)+n)%n;
}


//Takes a passed character and performs a shift
function encrypt(char) {
  var shift1 = 5;      //These values can be changed to have different shift values
  var shift2 = 4;      
  var shift3 = 6;      
  var shift4 = 3;      

  if (alphabetUp.includes(char))
  { 
      var position1 = alphabetUp.indexOf(char);      //Get position in of the original char
      var newPosition1 = (position1 + shift1)%26;                  //Perform the shift
      return alphabetUp[newPosition1]                                //return the new character
  }
  else if (alphabetLow.includes(char))
  { 
      var position2 = alphabetLow.indexOf(char);     
      var newPosition2 = (position2 + shift2)%26;               
      return alphabetLow[newPosition2]                             
  }
  else if (special.includes(char))
  { 
      var position3 = special.indexOf(char);      
      var newPosition3 = (position3 + shift3)%8;               
      return special[newPosition3]                               
  }
  else if (numbers.includes(char))
  { 
      var position4 = numbers.indexOf(char);    
      var newPosition4 = (position4 + shift4)%10;        
      return numbers[newPosition4]                              
  }
  else { return char }  
}


//Takes a passed character and performs a shift (back to the original char)
function decrypt(char) {
    var shift1 = 5;      //This value can be changed to have different shift values
    var shift2 = 4;      //This value can be changed to have different shift values
    var shift3 = 6;      //This value can be changed to have different shift values
    var shift4 = 3;      //This value can be changed to have different shift values

    if (alphabetUp.includes(char))
    { 
      var position1 = alphabetUp.indexOf(char);      //Get position in of the original char
      var newPosition1 = (position1 - shift1).mod(26);                  //Perform the shift
      return alphabetUp[newPosition1]                                //return the new character
    }
    else if (alphabetLow.includes(char))
    { 
      var position2 = alphabetLow.indexOf(char);     
      var newPosition2 = (position2 - shift2).mod(26);              
      return alphabetLow[newPosition2]                               
    }
    else if (special.includes(char))
    { 
        var position3 = special.indexOf(char);     
        var newPosition3 = (position3 - shift3).mod(8);                
        return special[newPosition3]                                
    }
    else if (numbers.includes(char))
    { 
        var position4 = numbers.indexOf(char);      
        var newPosition4 = (position4 - shift4).mod(10);                  
        return numbers[newPosition4]                                
    }
    else { return char }  
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

//Get Character Function
  //Uses random number to pick a character from letter arrays
  function getChar(salt, num) {
    var value;
    var index = Math.floor((salt*num)%26);
    switch (Math.floor((salt*num)%2)) {
      case 0:
        value =  alphabetUp[index];
        break;
      case 1:
        value =  alphabetLow[index];
      }
    return value;
  }

//Mask and Remove Mask are exported for server use
module.exports = {
  //Add Mask Function
    //Encrypts passed in array of characters
    //Creates number key and adds additional characters to the encrypted array
    //Masks number key and attaches to encrypted array
    //returns encrypted array as string
  addMaskSalt: function(line, salt) {
    line = line.map(line => encrypt(line));   //encrypt
    var middle = line;
    var numKey = salt;
    var keyValues = getValues(numKey);    //Generate values based on key
    var i;
    for (i=0; i<keyValues[0];i++) {   //Add characters based on values
        middle.push(getChar(salt, 11239));
    }
    for (i=0; i<keyValues[1];i++) {
        middle.unshift(getChar(salt, 31238));
    }
    var str = middle.join('');
    for (i = 0; i < str.length; i++) {
        middle[i]=(str.charAt(i));
    }
    for (i=0; i<keyValues[2];i++) {
        middle.splice(keyValues[3],0,getChar(salt, 91234));
    }
    for (i=0; i<keyValues[4];i++) {
        middle.splice(keyValues[5],0,getChar(salt, 81235));
    }
    for (i=0; i<keyValues[6];i++) {
        middle.splice(keyValues[7],0,getChar(salt, 74131));
    }
    line = middle.join('');
    return line;
  },

  //Remove Mask Function
    //Gets and unmasks number key from passed in encrypted array of characters
    //Removes additional characters from encrypted array using number key
    //Decrypts remaining encrypted array
    //Returns decrypted array as a string
  removeMaskSalt: function(line, salt) {
    var middle = line;
    var numKey = salt;    //key
    var i;
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
}