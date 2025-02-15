import React, { Suspense } from "react";
import Kitchen_table from "../../../public/Kitchen_table";

const Table = () => {
  return (
    <Suspense fallback={null}>
      <Kitchen_table />
    </Suspense>
  );
};

export default Table;
