import React, { Component } from 'react';
import PhoneBookForm from './PhoneBookForm/PhoneBookForm';
import { Container, Section } from './App.styled';
import { checkIfUserExists, contactsFilter } from 'utils/phoneBookUtils';
import { PhoneBookFilter } from './PhoneBookFilter/PhoneBookFilter';
import { PhoneBookList } from './PhoneBookList/PhoneBookList';
import { loadFromLocalStorage, saveToLocalStorage } from 'utils/helpers';

export default class App extends Component {
  state = {
    contacts: [],
    filter: '',
  };

  componentDidMount() {
    const savedContacts = loadFromLocalStorage('phoneBookContacts');
    if (savedContacts !== undefined) {
      this.setState({
        contacts: savedContacts,
      });
    }
  }

  componentDidUpdate(_, prevState) {
    const { contacts } = this.state;
    if (prevState.contact !== contacts) {
      saveToLocalStorage('phoneBookContacts', contacts);
    }
  }

  addContact = newContact => {
    const { contacts } = this.state;

    const checkResult = checkIfUserExists(contacts, newContact);
    if (checkResult) {
      alert(`${newContact.name} is already in contacts.`);
      return;
    }
    this.setState(prevState => ({
      contacts: [...prevState.contacts, newContact],
    }));
  };

  handeFilter = e => {
    const { value } = e.currentTarget;

    this.setState({
      filter: value,
    });
  };

  deleteContact = id => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== id),
    }));
  };

  render() {
    const { contacts, filter } = this.state;
    const filtered = contactsFilter(contacts, filter);

    return (
      <Section>
        <Container>
          <PhoneBookForm addContact={this.addContact} />
          <PhoneBookFilter handleFilter={this.handeFilter} />
          {filtered.length ? (
            <PhoneBookList
              contacts={filtered}
              deleteContact={this.deleteContact}
            />
          ) : null}
          {!filtered.length && contacts.length ? 'There are no matches!' : null}
        </Container>
      </Section>
    );
  }
}
