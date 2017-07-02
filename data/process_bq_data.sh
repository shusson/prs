find . -type f -exec gunzip {} \;
find . -type f -exec sed '1d' {} > ../prs.csv \;
