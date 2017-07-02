### Explore every PR between 2012 and 2017

This is a side project on the github archive.

Data is all PR events from 01/2012 to 06/2017. The data is extracted from
the archive using bigquery and extract_prs.sql[data/extract_prs.sql].

Visualizations are created using mapd-charting mapd-crossfilter and
mapd-connector.

The data is stored on MapD databases on AWS with P2 instances.
