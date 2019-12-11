import { DefaultRegistry } from "./defaultRegistry"

const registry = new DefaultRegistry("http://35.178.1.16/", "0x50ba770224D92424D72d382F5F367E4d1DBeB4b2")

registry.getNodeURL("DE", "VVV").then(console.log)
