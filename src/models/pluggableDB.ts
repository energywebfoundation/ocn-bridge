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
import { IVersionDetail } from "./ocpi/versions";

export interface IPluggableDB {
    getTokenB(): Promise<string>
    getTokenC(): Promise<string>
    setTokenB(tokenB: string): Promise<void>
    setTokenC(tokenC: string): Promise<void>
    saveEndpoints(versionDetail: IVersionDetail): Promise<void>
    getEndpoint(identifier: string, role: "SENDER" | "RECEIVER"): Promise<string>
}
