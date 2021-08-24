# The Virtual Keyboard

A virtual piano keyboard that runs in the browser. Suitable for teaching, learning, practicing, etc...!

- Shows notes on the grand staff as you play them on the keyboard.
- Responds to keyboard and mouse input
- Responds to MIDI input in Chrome and Edge browsers, using the [Web MIDI API](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) and [JZZ](https://github.com/jazz-soft/JZZ) library
- Settings to show note names, display keyboard shortcuts, make the notes sticky/sustain, change the colors, and re-size the keyboard for small and big screens.
- Settings are all saved to browser's local storage
- In development: Touch support and audio output

![Demo image of virtual keyboard](./demo.png)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Acknowledgements
- Paul Rosen's amazing [abcjs library](https://paulrosen.github.io/abcjs/) for the music staff display
- The  [JZZ library](https://jazz-soft.net/doc/JZZ/jzz.html) for connecting to MIDI devices
- [This video](https://www.youtube.com/watch?v=kMf1XWVY2cA) from [Suboptimal Engineer](https://github.com/SuboptimalEng) for the initial code and inspiration!

## Available Scripts

In the project directory, you can run:

### `npm install`
Installs the necessary dependencies.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.

