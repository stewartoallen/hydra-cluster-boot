Cluster Boot Service (CBS)
==========================

A web service that solves first-boot, start-dependency and node allocation through dynamic script
creation for Hydra compute clusters.

Getting Started
===============

 - ``npm install swig``
 - ``npm install node-uuid``
 - place your executable jar in ``config/image/default/lib/hydra.jar``
 - ``node start boothost=[HYDRA_BOOT]``
 - ``[HYDRA_BOOT]`` is the ``host:port`` of the CBS host as seen from booting nodes
 - create account  ``http://[HYDRA_BOOT]/api/create_account``
 - open the web interface at ``http://[HYDRA_BOOT]`` and enter your account ID

Boot Cluster Node
=================

 - ``bash <(curl -s "http://[HYDRA_BOOT]/boot?cluster=[CLUSTER_ID]")``
 - to boot a localstack, use ``localstack`` as your [CLUSTER_ID]

