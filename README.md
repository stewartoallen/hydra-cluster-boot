Cluster Boot Service
====================

A web service that solves first-boot, start-dependency and node allocation through dynamic script
creation for Hydra computer clusters.

GETTING STARTED
===============

 - ``npm install swig``
 - ``npm install node-uuid``
 - ``node start``

 - create account ``(http://[HYDRA_BOOT]/api/create_account)``
 - create cluster ``(http://[HYDRA_BOOT]/api/create_cluster?account=[ACCOUNT_ID])``

BOOT CLUSTER
============

 - ``bash <(curl -s "http://[HYDRA_BOOT]/render/boot?cluster=[CLUSTER_ID]")`

