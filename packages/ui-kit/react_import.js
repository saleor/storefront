// Fix for the `ReferenceError: React is not defined` error
// https://github.com/egoist/tsup/issues/390#issuecomment-933488738

import React from 'react'

export { React }