// Unit Tests
import EdChatTest from './unit/edChat';
import RelaysTest from './unit/relays/relays';
import RelayTest from './unit/relays/relay';
import ClientsTest from './unit/clients/clients';
import ClientTest from './unit/clients/client';
import CommandsTest from './unit/commands/commands';
import ApiPortTest from './unit/apiPort';

// Integration Tests
import EdChatApiPortTest from './integration/telegram/edChatApiPort';


// Execute Unit Tests
describe('Unit Test', () => {
    // new EdChatTest();
    new ApiPortTest();
    new RelaysTest();
    new RelayTest();
    new ClientsTest();
    new ClientTest();
    new CommandsTest();
});

// Execute Integration Tests
describe('Integration Test', () => {
    new EdChatApiPortTest();
});
