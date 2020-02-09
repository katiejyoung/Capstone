//Source: https://www.sitepoint.com/how-to-build-a-cipher-machine-with-javascript/
//Includes encrypt and decrypt functions
//Performs basic shift encryption, different shifts are used for different char types

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
  const shift1 = 5;      //This value can be changed to have different shift values
  const shift2 = 4;      //This value can be changed to have different shift values
  const shift3 = 6;      //This value can be changed to have different shift values
  const shift4 = 3;      //This value can be changed to have different shift values

  if (alphabetUp.includes(char))
  { 
      const position1 = alphabetUp.indexOf(char);      //Get position in of the original char
      const newPosition1 = (position1 + shift1)%26;                  //Perform the shift
      return alphabetUp[newPosition1]                                //return the new character
  }
  else if (alphabetLow.includes(char))
  { 
      const position2 = alphabetLow.indexOf(char);      //Get position in of the original char
      const newPosition2 = (position2 + shift2)%26;                  //Perform the shift
      return alphabetLow[newPosition2]                                //return the new character
  }
  else if (special.includes(char))
  { 
      const position3 = special.indexOf(char);      //Get position of the original char
      const newPosition3 = (position3 + shift3)%8;                  //Perform the shift
      return special[newPosition3]                                //return the new character
  }
  else if (numbers.includes(char))
  { 
      const position4 = numbers.indexOf(char);      //Get position of the original char
      const newPosition4 = (position4 + shift4)%10;                  //Perform the shift
      return numbers[newPosition4]                                //return the new character
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
      const position2 = alphabetLow.indexOf(char);      //Get position in of the original char
      const newPosition2 = (position2 - shift2).mod(26);                  //Perform the shift
      return alphabetLow[newPosition2]                                //return the new character
    }
    else if (special.includes(char))
    { 
        const position3 = special.indexOf(char);      //Get position of the original char
        const newPosition3 = (position3 - shift3).mod(8);                  //Perform the shift
        return special[newPosition3]                                //return the new character
    }
    else if (numbers.includes(char))
    { 
        const position4 = numbers.indexOf(char);      //Get position of the original char
        const newPosition4 = (position4 - shift4).mod(10);                  //Perform the shift
        return numbers[newPosition4]                                //return the new character
    }
    else { return char }  
}

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

  function convNum(preNum) {
    var postNums =[];
    postNums[0] = Math.floor((( (preNum*3) /6) %4) +1);
    postNums[1] = Math.floor((( (preNum*5) /2) %4) +1);
    postNums[2] = Math.floor((( (preNum/7) *3) %3) +2);
    postNums[3] = Math.floor((( (preNum/8) *9) %3) +6);
    postNums[4] = Math.floor((( (preNum*3) *6) %3) +2);
    postNums[5] = Math.floor((( (preNum*5) *2) %4) +6);
    postNums[6] = Math.floor((( (preNum/7) /3) %3) +2);
    postNums[7] = Math.floor((( (preNum/8) /9) %3) +6);
    return postNums;
  }

  function addMask(line) {
    line = line.map(line => encrypt(line));
    var middle = line;
    var enNum = Math.floor(Math.random() * 90000) + 10000;
    var clipNum = convNum(enNum);
    var i;
    for (i=0; i<clipNum[0];i++) {
        middle.push(getChar());
    }
    for (i=0; i<clipNum[1];i++) {
        middle.unshift(getChar());
    }
    var str = middle.join('');
    for (i = 0; i < str.length; i++) {
      middle[i]=(str.charAt(i));
    }
    for (i=0; i<clipNum[2];i++) {
      middle.splice(clipNum[3],0,getChar());
    }
    for (i=0; i<clipNum[4];i++) {
      middle.splice(clipNum[5],0,getChar());
    }
    for (i=0; i<clipNum[6];i++) {
      middle.splice(clipNum[7],0,getChar());
    }
    middle.unshift(enNum);
    line = middle.join('');
    return line;
  }

  function removeMask(line) {
    var middle = line;
    var enNumPre = middle.slice(0,5);
    var enNum = enNumPre.join('');
    var i;
    for (i=0; i<5;i++) {
        middle.shift();
    }
    var clipNum = convNum(enNum);
    var str = middle.join('');
    for (i = 0; i < str.length; i++) {
      middle[i]=(str.charAt(i));
    }
    middle.splice(clipNum[7],clipNum[6]);
    middle.splice(clipNum[5],clipNum[4]);
    middle.splice(clipNum[3],clipNum[2]);
    for (i=0; i<clipNum[0];i++) {
        middle.pop();
    }
    for (i=0; i<clipNum[1];i++) {
        middle.shift();
    }
    middle = middle.map(middle => decrypt(middle));
    line = middle.join('');
    return line;
  }
