#!/usr/bin/env node

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var chance = new require('chance').Chance();
var Nightmare = require('nightmare');

var program = require('commander');

program
  .version(pkg.version)
  .parse(process.argv);

console.log('creating new account...');
console.log(generateUser());

var user = generateUser();

new Nightmare()
  .goto('https://www.leapset.com/order/profile/create')
    .type('#account_email', user.email)
    .type('#account_phone1', user.phone.npa)
    .type('#account_phone2', user.phone.co)
    .type('#account_phone3', user.phone.line)
    .type('#account_pwd', user.password)
    .type('#account_confirm_pwd', user.password)
    .wait()
    .screenshot('/tmp/img.png')
    .run(function (err, nightmare) {
      if (err) {
        console.error(err);
      }
    });

function generateUser () {
  return {
    name: 'John Doe',
    email: chance.email(),
    phone: {
      npa: randomNumericString(3),
      co: randomNumericString(3),
      line: randomNumericString(4)
    },
    password: 'foobarfoobar1'
  };
}

function randomNumericString (length) {
  return chance.string({length: length, pool: '0123456789'});
}
