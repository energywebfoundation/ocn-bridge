/*
    Copyright 2019-2020 eMobilify GmbH

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/
import { DefaultRegistry } from "./defaultRegistry"

const registry = new DefaultRegistry("http://35.178.1.16/", "0x50ba770224D92424D72d382F5F367E4d1DBeB4b2")

registry.getNodeURL("DE", "VVV").then(console.log)
