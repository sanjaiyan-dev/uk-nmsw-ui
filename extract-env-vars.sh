#!/bin/sh

IFS=$'\n'
VAL_FILE=$1
OUTPUT_FILE=$2

printHelp()
{
	# Display Help
	echo "Extract environment variables in key=value format from a Helm values file."
	echo
	echo "Syntax: ./${0##*/} helm_values_yaml output_file"
	echo
}


if [[ ! -s "$VAL_FILE" ]]; then
	echo "Please enter the correct number of arguments."
	echo "Helm values file \"${VAL_FILE}\" could not be opened."
	printHelp
	exit 1
elif [[ -z $OUTPUT_FILE ]]; then
	echo "Please enter the correct number of arguments."
	printHelp
	exit 1
fi
	


echo "Extracting environment variables from Helm chart variables file."

# Copy everything from 'application:' until 'proxy:' (EXCLUSIVE)
awk '/application:/{flag=1; next} /proxy:/{flag=0} flag' $VAL_FILE > tmp-val.txt

# Format yaml to variables
awk -v nlines_after=2 '/secretKeyRef:/ {for (i=0; i<nlines_after; i++) {getline} ;next} 1' tmp-val.txt | tac |\
awk -v nlines_before=1 '/valueFrom:/{for (i=0; i<nlines_before; i++) {getline}; next} 1' | tac > new-tmp.txt

mv new-tmp.txt tmp-val.txt
cat tmp-val.txt | tr -d '\n' | sed 's/\s\+- name: /\n/g; s/\s\+value: /=/g' > ${OUTPUT_FILE}
rm tmp-val.txt

# Remove any blank lines at start of file
sed -i '/^$/d' ${OUTPUT_FILE}

# Append blank line to file
echo >> ${OUTPUT_FILE}

if [ $? -eq 0 ]; then
	echo "Successfully created \"./${OUTPUT_FILE}\""
	exit 0
fi
echo "Failed to create \"./${OUTPUT_FILE}\""
exit 1
