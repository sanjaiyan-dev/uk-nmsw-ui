#!/bin/sh

IFS=$'\n'
VAL_FILE=$1

if [ ! -s "$VAL_FILE" ]; then
	echo "File \"${VAL_FILE}\" could not be opened."
	exit 1
fi

echo "Extracting environment variables from Helm chart variables file."

# Copy everything from 'application:' until 'proxy:' (EXCLUSIVE)
awk '/application:/{flag=1; next} /proxy:/{flag=0} flag' $VAL_FILE > tmp-val.txt

# Format yaml to variables
cat tmp-val.txt | tr -d '\n' | sed 's/\s\+- name: /\n/g; s/\s\+value: /=/g' > cypress-env.sh
rm tmp-val.txt

# Remove any blank lines at start of file
sed -i '/^$/d' cypress-env.sh

# Append blank line to file
echo >> cypress-env.sh

if [ $? -eq 0 ]; then
	echo "Successfully created \"./cypress-env.sh\""
	exit 0
fi
echo "Failed to create \"./cypress-env.sh\""
exit 1
