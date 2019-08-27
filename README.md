# grasshopper-ts

Grasshopper GOST 3412-2015 ECB implementation with TypeScript

## Installation

### yarn

```sh
yarn add grasshopper-ts
```

### npm

```sh
npm install grasshopper-ts
```

## Usage

```js
import { decryptString, encryptString, generateKey } from 'grasshopper-ts'

const key = generateKey()
const message = 'Hello World!'

const encrypted = encryptString(message, key)
const decrypted = decryptString(encrypted, key)
```
