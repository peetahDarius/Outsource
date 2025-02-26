import { useEffect, useRef, useState } from "react";
import ClientDetails from "../../components/invoice/ClientDetails";
import Dates from "../../components/invoice/Dates";
import Footer from "../../components/invoice/Footer";
import Header from "../../components/invoice/Header";
import MainDetails from "../../components/invoice/MainDetails";
import Notes from "../../components/invoice/Notes";
import Table from "../../components/invoice/Table";
import TableForm from "../../components/invoice/TableForm";
import ReactToPrint from "react-to-print";
// import "../../Quotation.css";
import axios from "axios";
import { useLocation } from "react-router-dom";

function Quotation() {
  const location = useLocation();
  const client = location.state?.client;
  const [showInvoice, setShowInvoice] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [website, setWebsite] = useState("");
  const [clientName, setClientName] = useState(
    `${client.first_name} ${client.last_name}`
  );
  const [clientAddress, setClientAddress] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState();
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString());
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [prefix, setPrefix] = useState("")

  const generateInvoiceNum = () => {
    const num = 5;
    const formattedNumber = String(num).padStart(3, "0");
    setInvoiceNumber(`${prefix}${formattedNumber}`) ;
  };
  
  const componentRef = useRef();
    
    useEffect(() => {
      generateInvoiceNum()
    },[prefix])

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const url = "http://127.0.0.1:5020/quotation/credentials/";
      const response = await axios.get(url);
      const data = response.data;
      setName(data.name);
      setAddress(data.address);
      setEmail(data.email);
      setWebsite(data.website);
      setPhone(data.phone);
      setBankName(data.bank_name);
      setBankAccount(data.paybill_number);
      setPrefix(data.prefix)
    } catch (error) {
      console.error(error);
    }
  };

  const handlePrint = () => {
    // window.print();
  };
  return (
    <>
      <main className="m-5 p-5 md:max-w-xl md:mx-auto lg:max-w-2xl xl:max-w-4xl bg-white rounded shadow ">
        {showInvoice ? (
          <>
            <ReactToPrint
              trigger={() => (
                <button className="mb-5 ml-5 bg-blue-500 py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 text-white transition-all duration-300">
                  {" "}
                  Print / Download
                </button>
              )}
              content={() => componentRef.current || null}
              documentTitle="invoice1"
            />
            <div ref={componentRef} className="p-10 text-black">
              <Header handlePrint={handlePrint} />
              <MainDetails name={name} address={address} />
              <ClientDetails
                clientName={clientName}
                clientAddress={clientAddress}
              />
              <Dates
                invoiceDate={invoiceDate}
                invoiceNumber={invoiceNumber}
                dueDate={dueDate}
              />
              <Table
                description={description}
                quantity={quantity}
                price={price}
                amount={amount}
                list={list}
                setList={setList}
                total={total}
                setTotal={setTotal}
              />
              <Notes notes={notes} />
              <Footer
                name={name}
                address={address}
                website={website}
                email={email}
                phone={phone}
                bankAccount={bankAccount}
                bankName={bankName}
              />
            </div>

            <button
              onClick={() => setShowInvoice(false)}
              className="bg-blue-500 py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 text-white transition-all duration-300"
            >
              Edit Information
            </button>
          </>
        ) : (
          <>
            {/* name, email, phone number, bank name, bankaccno, website, address, clientName, clientAddress, Invoice number, dueDate, notes */}
            <div className="flex flex-col justify-center">
              <article className="md:grid grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="name"
                  >
                    {" "}
                    Enter your name
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="name"
                    id="text"
                    placeholder="Enter your name"
                    autoComplete="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="address"
                  >
                    {" "}
                    Enter your addres
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="address"
                    id="address"
                    placeholder="Enter your address"
                    autoComplete="off"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </article>

              <article className="md:grid grid-cols-3 gap-10">
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="email"
                  >
                    {" "}
                    Enter your email
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="website"
                  >
                    {" "}
                    Enter your website
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="url"
                    name="website"
                    id="website"
                    placeholder="Enter your website"
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="phone"
                  >
                    {" "}
                    Enter your phone
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="tel"
                    name="phone"
                    id="phone"
                    placeholder="Enter your phone"
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </article>

              <article className="md:grid grid-cols-2 gap-10">
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="bankName"
                  >
                    {" "}
                    Enter your Bank Name
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="bankName"
                    id="bankName"
                    placeholder="Enter your bank name"
                    autoComplete="off"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="bankAccount"
                  >
                    Enter your Bank Account number
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="bankAccount"
                    id="bankAccount"
                    placeholder="Enter your bank account number"
                    autoComplete="off"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </div>
              </article>

              <article className="md:grid grid-cols-2 gap-10 md:mt-16">
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="clientName"
                  >
                    {" "}
                    Enter the clientName
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="clientName"
                    id="clientName"
                    placeholder="Enter the clientName"
                    autoComplete="off"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="clientAddress"
                  >
                    {" "}
                    Enter the clientAddress
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="clientAddress"
                    id="clientAddress"
                    placeholder="Enter the clientAddress"
                    autoComplete="off"
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                  />
                </div>
              </article>

              <article className="md:grid grid-cols-3 gap-10">
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="invoiceNumber"
                  >
                    {" "}
                    Enter the invoiceNumber
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="invoiceNumber"
                    id="invoiceNumber"
                    placeholder="Enter the invoiceNumber"
                    autoComplete="off"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="invoiceDate"
                  >
                    {" "}
                    Enter the invoiceDate
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="date"
                    name="invoiceDate"
                    id="invoiceDate"
                    placeholder="Enter the invoiceDate"
                    autoComplete="off"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    className="mb-1 text-lg font-semibold text-gray-800"
                    htmlFor="dueDate"
                  >
                    {" "}
                    Enter the dueDate
                  </label>
                  <input
                    className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                    type="text"
                    name="dueDate"
                    id="dueDate"
                    placeholder="Enter the dueDate"
                    autoComplete="off"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </article>

              {/* our table form */}
              <article>
                <TableForm
                  description={description}
                  setDescription={setDescription}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  price={price}
                  setPrice={setPrice}
                  amount={amount}
                  setAmount={setAmount}
                  list={list}
                  setList={setList}
                  total={total}
                  setTotal={setTotal}
                />
              </article>

              <label
                className="mb-1 text-lg font-semibold text-gray-800"
                htmlFor="notes"
              >
                {" "}
                Additional notes
              </label>
              <textarea
                className="bg-gray-200 p-2 rounded-sm mb-8 text-gray-600 font-semibold"
                name="notes"
                id="notes"
                cols="30"
                rows="10"
                placeholder="Additional notes to client"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>

              <button
                onClick={() => setShowInvoice(true)}
                className="bg-blue-500 py-2 px-8 rounded shadow border-2 border-blue-500 hover:bg-transparent hover:text-blue-500 text-white transition-all duration-300"
              >
                Preview Invoice
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default Quotation;
