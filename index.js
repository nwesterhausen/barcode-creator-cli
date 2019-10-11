const { DOMImplementation, XMLSerializer } = require('xmldom');
const JsBarcode = require('jsbarcode');

const FORMAT_OPTIONS = [
  'CODE128',
  'CODE128A',
  'CODE128B',
  'CODE128C',
  'UPC',
  'EAN13',
  'EAN8',
  'EAN5',
  'EAN2',
  'CODE39',
  'ITF14',
  'MSI',
  'MSI10',
  'MSI11',
  'MSI1010',
  'MSI1110',
  'pharmacode',
  'codabar'
];

const OUTPUT_OPTIONS = ['png', 'jpeg'];

const args = require('minimist')(process.argv.slice(2), {
  alias: {
    f: 'format',
    o: 'outputfile',
    t: 'text',
    x: 'width',
    y: 'height',
    h: 'help',
    v: ['verbose', 'debug'],
    T: ['notext', 'hideValue']
  },
  boolean: ['help', 'verbose'],
  default: {
    outputfile: 'barcode.png',
    format: 'CODE128',
    help: false,
    verbose: false,
    width: 2,
    height: 100,
    hideValue: false
  }
});
// Debug logging
if (args.debug) console.info(`Format specified: ${args.format}`);
if (args.debug) console.info(`Output file specified: ${args.outputfile}`);

let fileext = args.outputfile
  .substring(args.outputfile.length - 4)
  .replace(/\./, '');

if (args.debug) console.info(`Discovered extension ${fileext}`);

if (
  args.help ||
  FORMAT_OPTIONS.indexOf(args.format) == -1 ||
  OUTPUT_OPTIONS.indexOf(fileext) == -1
) {
  if (FORMAT_OPTIONS.indexOf(args.format) == -1) {
    console.error(`Specified invalide option for format: ${args.format}\n`);
  }
  if (OUTPUT_OPTIONS.indexOf(fileext) == -1) {
    console.error(
      `Specified invalid extension (${fileext}) on output file: ${args.outputfile}\n`
    );
  }
  console.log(`Use like this:
${process.argv[1]} [-f FORMAT -o OUTPUT] barcodetext

Options:
  -f, --format=       Specify a barcode format.
                        [Default: CODE128]
  -h, --help          Show this help message and quit.
  -o, --outputfile=   Specify an output file.
                        [Default: ./barcode.png]
  -t, --text=         Specify what text is at the bottom of the barcode.
                        [Default: text is the same as the barcode]
  -T, --notext        Do not display anything at the bottom of the barcode.
  -x, --width=        Specify width of the barcode bar (in pixels)
                        [Default value: 2]
  -y, --height=       Specify height of the barcode (in pixels)
                        [Default value: 100]

  For example to create a barcode without text at the bottom:
    barcode-creator --text='' 11235

  For example to create a barcode with different text than content:
    barcode-creator --text='Continue' "cont"

Format Options:
  - ${FORMAT_OPTIONS.join('\n  - ')}

Output Options:
  - ${OUTPUT_OPTIONS.join('\n  - ')}
    `);
  process.exit(1);
}

// Canvas v2
const { createCanvas, registerFont } = require('canvas');
// Canvas v2
registerFont('UbuntuMono-Regular.ttf', { family: 'Ubuntu Mono' });
var canvas = createCanvas();

const content = args._.length > 0 ? args._[0] : 'Test';
if (args.debug && content === 'Test')
  console.info(`Using generic value of 'TEST' for the barcode.`);
else if (args.debug)
  console.info(`Using provided value of '${content}' for the barcode.`);

// If we pass an empty string, set hideValue so we display nothing.
if (args.hasOwnProperty('text')) {
  if (args.text.length === 0) args.hideValue = true;
}

// Debug Logging
if (args.debug) console.info(`-T flag (do not print text): ${args.hideValue}`);

const options = {
  text: args.text,
  format: args.format,
  displayValue: !args.hideValue,
  width: args.width,
  height: args.height,
  font: 'Ubuntu Mono',
  fontSize: 48
};

JsBarcode(canvas, content, options);

if (args.debug)
  console.info(`Final image is ${canvas.width} x ${canvas.height}`);

const barcodeBuffer =
  fileext === 'png'
    ? canvas.toBuffer('image/png')
    : canvas.toBuffer('image/jpeg');
require('fs').writeFileSync(args.outputfile, barcodeBuffer);
process.exit();
