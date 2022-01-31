# OCN Bridge

The Open Charging Network Bridge is an OCPI interface designed to be used with pluggable backoffice APIs.

Right now the focus is on providing Charge Point Operator interfaces, but this could be extended to Mobility Service Providers and others in the future.

## Usage:

The bridge can be used in the following way:

```
npm install https://bitbucket.org/shareandcharge/ocn-bridge.git
```

Then can be included in a project in several ways:

In TypeScript, the `startBridge` bootstrap function can be imported directly (or alternatively with `*` syntax):

```ts
import { startBridge, stopBridge } from "ocn-bridge"
```

Using JavaScript, the module can be imported as follows:

```js
const ocnBridge = require("ocn-bridge")
```

To start the bridge, call the `startBridge` function with a configuration object that implements `IBridgeConfigurationOptions`:

```ts
startBridge({

    // publicly available URL of the Bridge
    // note the bridge binds to localhost; use a reverse proxy like Nginx with SSL
    publicBridgeURL: "http://bridge.cpo.net",

    // publicly available URL of the OCN node to connect to
    ocnNodeURL: "http://node.ocn.net",

    // set the bridge to use OCPI credentials roles
    roles: [
        {
            role: "CPO",
            business_details: {
                name: "Super CPO Ltd."
            },
            country_code: "GB",
            party_id: "SUP"
        }
    ],

    // specify the desired OCPI modules to be shared (must match pluggableAPI below)
    // must implement IModules
    modules: {
        implementation: ModuleImplementation.CUSTOM,
        // sender and receiver only needed if implmentation is CUSTOM
        sender: ["locations"],
        receiver: []
    }

    // EMSP or CPO Backoffice API plug-in to use; must implement IPluggableAPI
    pluggableAPI: new PluggableAPI(),

    // Interface providing getting/setting of important OCPI variables (token auth, endpoints, etc.)
    // must implement IPluggableDB
    pluggableDB: new PluggableDB(),

    // Interface providing writing/reading from an OCN Registry
    // must implement IPluggableRegistry (a DefaultRegistry class is provided in this case)
    // if writing to the registry must provide private key as second optional
    pluggableRegistry: new DefaultRegistry("local", "0x123...")

    // [optional, default=false] set to true for morgan to log to stdout
    logger: true,

    // [optional, default=3000] set the internal port to listen on
    port: 3001,

    // [optional, default=false] use SIGNER_KEY to sign requests/responses
    signatures: false

    // [optional] private key used to sign OCPI requests (needed if signatures: true)

    // [optional] token A for OCPI registration (credentials handshake) with OCN Node
    tokenA: "token-a"

}).then((bridge: http.Server) => {

    /* continue */

}).catch((err: Error) => {

/* handle error */

})
```

A bridge can then be cleanly stopped using the `stopBridge` function:

```ts
await stopBridge(bridge)
```

### Registering an OCPI Party

The registration functionality is exposed once the bridge is running. Parties
are taken from the `roles` attribute used in starting the bridge.

Firstly, the OCN Bridge will check the status of the OCPI party in the OCN Registry. If they are unlisted, or
they are listed under a different OCN node as the one provided in the configuration, the OCN Bridge will
attempt to register them. To do this, it is necessary to at least set the environment variable, `SIGNER_KEY`,
describing the private key to use as the signer. If the signer is to be different from the _spender_ (the
wallet paying for the transaction), then it is possible to also set a `SPENDER_KEY`, otherwise the two will
be the same. For example:

Secondly, the OCN Bridge will check whether there is already a connection to an OCN node. If not, a POST
`credentials` request will be sent to the desired OCN node. To do this, another environment variable is
needed. The `TOKEN_A` environment variable is obtained from the OCN node and is needed to complete the
OCPI connection with it. Ask the administrator of the OCN node for it if this is missing.

