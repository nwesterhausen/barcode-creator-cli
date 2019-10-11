const { DOMImplementation, XMLSerializer } = require('xmldom');
const JsBarcode = require('jsbarcode');
const QRCode = require('qrcode');

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
  'codabar',
  'QRCODE'
];

const OUTPUT_OPTIONS = ['png', 'svg'];

const args = require('minimist')(process.argv.slice(2), {
  alias: {
    f: 'format',
    o: 'outputfile',
    t: 'text',
    x: ['width', 'barwidth'],
    y: ['height', 'barheight'],
    h: 'help',
    v: ['verbose', 'debug'],
    T: ['notext', 'hideValue'],
    s: ['fontSize, size']
  },
  boolean: ['help', 'verbose'],
  default: {
    outputfile: 'barcode.png',
    format: 'CODE128',
    help: false,
    verbose: false,
    width: 2,
    height: 100,
    hideValue: false,
    size: 24
  }
});
// Debug logging
if (args.debug) console.info(`Format specified: ${args.format}`);
if (args.debug) console.info(`Output file specified: ${args.outputfile}`);

let fileext = args.outputfile
  .substring(args.outputfile.length - 4)
  .replace(/\./, '');
if (fileext === 'jpg') fileext = 'jpeg';

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

  -o, --outputfile=   Specify an output file. QRCODE requires .png!
                        [Default: ./barcode.png]

  -t, --text=         Specify what text is at the bottom of the barcode.
                      Only valid for 1D barcodes.
                        [Default: text is the same as the barcode]

  -s, --fontSize=,    Specify the fontSize for the text under the barcode.
    --size=           Only valid for 1D barcodes.

  -T, --notext        Do not display anything at the bottom of the barcode.
                      Only valid for 1D barcodes.

  -x, --barwidth=     Specify width of the barcode bars (in pixels)
                      Only valid for 1D barcodes.
                        [Default value: 2]

  -y, --barheight=    Specify height of the barcode bars (in pixels)
                      Only valid for 1D barcodes.
                        [Default value: 100]

  EXAMPLES:
  To create a barcode without text at the bottom:
    barcode-creator --text='' 11235

  To create a barcode with different text than content:
    barcode-creator --text='Continue' "cont"

  To create a QRCode for a give URL:
    barcode-creator -f QRCODE 'https://google.com'

Format Options:
  - ${FORMAT_OPTIONS.join('\n  - ')}

Output Options:
  - ${OUTPUT_OPTIONS.join('\n  - ')}
    `);
  process.exit(1);
}

const content = args._.length > 0 ? args._[0] : 'Test';
if (args.debug && content === 'Test')
  console.info(`Using generic value of 'TEST' for the barcode.`);
else if (args.debug)
  console.info(`Using provided value of '${content}' for the barcode.`);

if (args.format === 'QRCODE') createQRCode();
else if (fileext === 'svg') createSvgBarcode();
else createPngJpegBarcode();

/////////////////////////////////////////////////////////////
function getCanvas() {
  // Canvas v2
  const { createCanvas, registerFont } = require('canvas');
  // Canvas v2
  registerFont('fonts/UbuntuMono-Regular.ttf', { family: 'Ubuntu Mono' });
  return createCanvas();
}

function createQRCode() {
  const opts = {
    type: fileext
  };
  QRCode.toFile(args.outputfile, content, opts, err => {
    if (err) throw err;
  });
}

function createPngJpegBarcode() {
  let canvas = getCanvas();

  // If we pass an empty string, set hideValue so we display nothing.
  if (args.hasOwnProperty('text')) {
    if (args.text.length === 0) args.hideValue = true;
  }

  // Debug Logging
  if (args.debug)
    console.info(`-T flag (do not print text): ${args.hideValue}`);

  const options = {
    text: args.text,
    format: args.format,
    displayValue: !args.hideValue,
    width: args.width,
    height: args.height,
    font: 'Ubuntu Mono',
    fontSize: 36
  };

  JsBarcode(canvas, content, options);

  if (args.debug)
    console.info(`Final image is ${canvas.width} x ${canvas.height}`);

  const barcodeBuffer =
    fileext === 'png'
      ? canvas.toBuffer('image/png')
      : canvas.toBuffer('image/jpeg');
  require('fs').writeFileSync(args.outputfile, barcodeBuffer);
}

function createSvgBarcode() {
  const xmlSerializer = new XMLSerializer();
  const document = new DOMImplementation().createDocument(
    'http://www.w3.org/1999/xhtml',
    'html',
    null
  );
  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  JsBarcode(svgNode, content, {
    xmlDocument: document
  });

  const svgText = xmlSerializer.serializeToString(svgNode);
  require('fs').writeFileSync(args.outputfile, svgText);
}
