"use client";

import {
  Chip,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
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

export default function TableWithSearch() {
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
    // TODO: debounce, handle deletion
    setSearchTerm(String(e.target.value || "").toLowerCase());

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
              advocate.phoneNumber
                .toString()
                .toLowerCase()
                .includes(searchTerm.replace(/-\s\(\)/g, ""))
            );
          })
        : advocates;

    setFilteredAdvocates(filteredAdvocates);
    setIsLoading(false);
  };

  const onClear = () => {
    console.log(advocates);
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

  const asPhoneNumber = (phoneNumber: number) => {
    const phoneNumberString = phoneNumber.toString();
    return `(${phoneNumberString.slice(0, 3)}) ${phoneNumberString.slice(
      3,
      6
    )}-${phoneNumberString.slice(6)}`;
  };

  return (
    <div>
      <Input
        onChange={onChange}
        onClear={onClear}
        id="search-term"
        isClearable
        value={searchTerm}
        aria-label="Search for an advocate"
        label="Search for an advocate"
      />
      <Table aria-label="List of advocates" isStriped>
        <TableHeader>
          <TableColumn>First Name</TableColumn>
          <TableColumn>Last Name</TableColumn>
          <TableColumn>City</TableColumn>
          <TableColumn>Degree</TableColumn>
          <TableColumn>Specialties</TableColumn>
          <TableColumn>Years of Experience</TableColumn>
          <TableColumn>Phone Number</TableColumn>
        </TableHeader>
        <TableBody
          emptyContent={isLoading ? "Loading..." : "No advocates found."}
        >
          {filteredAdvocates.map((advocate) => {
            return (
              <TableRow key={advocate.id}>
                <TableCell>{advocate.firstName}</TableCell>
                <TableCell>{advocate.lastName}</TableCell>
                <TableCell>{advocate.city}</TableCell>
                <TableCell>{advocate.degree}</TableCell>
                <TableCell>
                  {advocate.specialties.map((s) => (
                    <Chip size="sm" key={s}>
                      {s}
                    </Chip>
                  ))}
                </TableCell>
                <TableCell>{advocate.yearsOfExperience}</TableCell>
                <TableCell>{asPhoneNumber(advocate.phoneNumber)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
