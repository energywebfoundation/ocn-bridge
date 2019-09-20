# OCN Bridge

The Open Charging Network Bridge is an OCPI interface designed to be used with pluggable backoffice APIs.

Right now the focus is on providing Charge Point Operator interfaces, but this could be extended to Mobility Service Providers and others in the future.

## Usage:

The bridge can be used in the following way (make sure you have permissions to read this repository):

```
npm install git+ssh://git@bitbucket.org:shareandcharge/ocn-bridge.git
```

Then can be included in a project:

```ts
import { startServer } from "ocn-bridge"

startServer({ /* configuration values including API plugin to use*/})
    .then(/* continue */)
    .catch(/* handle error */)
```

The API plugin interface is still to be defined.
