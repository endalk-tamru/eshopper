import Header from "../components/Header";
import PageHeader from "../components/PageHeader";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const Contact = () => {
  return (
    <>
      <Header />
      <PageHeader title="Contact Us" subTitle="Contact" />
      <ContactForm />
      <Footer />
    </>
  );
};

export default Contact;
