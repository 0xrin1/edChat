import { assert, expect } from 'chai';

import Commands from '../../../messaging/commands/commands';

export default class CommandsTest {
  constructor() {
    describe('Commands Test', () => {
      it('new Commands() to be an instance of Commands', () => {
        expect(new Commands()).to.be.an.instanceof(Commands);
      });

      it('Command index r key mapped to setRelay function', () => {
        const commands: Commands = new Commands();
        const checkFunction = commands.index.get('r');
        assert.equal(checkFunction, commands.setRelay);
      });

      it('Command index u key mapped to unsetRelay function', () => {
        const commands: Commands = new Commands();
        const checkFunction = commands.index.get('u');
        assert.equal(checkFunction, commands.unsetRelay);
      });
    });
  }
}
