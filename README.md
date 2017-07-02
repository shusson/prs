## Explore every GitHub PR between 2012 and 2017

This is a side project I did for fun over the weekend.

Data is all PR events from 01/2012 to 06/2017. The data is extracted from
the archive using BigQuery and [data/extract_prs.sql](data/extract_prs.sql).

The data is stored on containerized [MapD](https://github.com/mapd/mapd-core) databases on AWS P2 instances.

The web app is built with angular and hosted on firebase. Visualizations are created using [mapd-charting](https://github.com/mapd/mapd-charting), [mapd-crossfilter](https://github.com/mapd/mapd-crossfilter) and
[mapd-connector](https://github.com/mapd/mapd-connector).

### Local deployment

#### Database

MapD can work with out without a GPU. I'm using docker to simplify the
deployment process. There are two docker compose files, one for loading the data [data/docker-compose.yml](data/docker-compose.yml), and one for running the services [docker-compose.yml](docker-compose.yml). Both use a `.env` file to determine what MapD image to run. Currently I'm using my own personal images on docker hub, but you can build your own with https://github.com/shusson/docker-mapd or follow the official guide https://github.com/mapd/mapd-core/tree/master/docker.

I haven't automated getting the data from the github archive. The manual process is as follows:
- Use bigquery web console to create a new table from the results of [data/extract_prs.sql](data/extract_prs.sql).
- Export table into a GCP bucket (since the data is larger than 1GB you will have to use sharding)
- Download bucket contents and process with [data/process_bq_data.sh](data/process_bq_data.sh) to create a file `data/prs.csv` which will be loaded by mapd.

Load the data (only required the first time)
```bash
cd data
dc up
```

Run database and services
```bash
cd ..
dc up
```

#### Web app
Modify the environment file [dashboard/src/environments/environment.ts](dashboard/src/environments/environment.ts) to point to your MapD server.

```bash
cd dashboard
ng serve
```
Browse to http://localhost:4200
