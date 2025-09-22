"use client";

import { useEffect, useState } from "react";

interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
}

export default function Table() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
        setIsLoading(false);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(String(e.target.value).toLowerCase());

    console.log("filtering advocates...");
    setIsLoading(true);

    const filteredAdvocates =
      searchTerm?.length > 0
        ? advocates.filter((advocate) => {
            return (
              advocate.firstName.toLowerCase().includes(searchTerm) ||
              advocate.lastName.toLowerCase().includes(searchTerm) ||
              advocate.city.toLowerCase().includes(searchTerm) ||
              advocate.degree.toLowerCase().includes(searchTerm) ||
              advocate.specialties
                .join("")
                .toLowerCase()
                .includes(searchTerm) ||
              advocate.yearsOfExperience
                .toString()
                .toLowerCase()
                .includes(searchTerm) ||
              advocate.phoneNumber.toString().toLowerCase().includes(searchTerm)
            );
          })
        : advocates;

    setFilteredAdvocates(filteredAdvocates);
    setIsLoading(false);
  };

  const onClick = () => {
    console.log(advocates);
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  return (
    <div>
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          style={{ border: "1px solid black" }}
          onChange={onChange}
          id="search-term"
          value={searchTerm}
        />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      {filteredAdvocates?.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>City</th>
              <th>Degree</th>
              <th>Specialties</th>
              <th>Years of Experience</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdvocates.map((advocate) => {
              return (
                <tr key={advocate.id}>
                  <td>{advocate.firstName}</td>
                  <td>{advocate.lastName}</td>
                  <td>{advocate.city}</td>
                  <td>{advocate.degree}</td>
                  <td>
                    {advocate.specialties.map((s) => (
                      <div key={s}>{s}</div>
                    ))}
                  </td>
                  <td>{advocate.yearsOfExperience}</td>
                  <td>{advocate.phoneNumber}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>No results found</div>
      )}
    </div>
  );
}
