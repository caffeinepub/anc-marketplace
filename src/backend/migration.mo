import Map "mo:core/Map";
import Principal "mo:core/Principal";
import List "mo:core/List";

module {
  public type Actor = {
    // The old type does not include policySignaturesByUser
    // All other data is preserved automatically.
  };

  public type PolicySignatureRecord = {
    policyIdentifier : { #privacy; #shipping; #returns; #terms };
    policyVersion : Text;
    signerName : Text;
    signature : Text;
    timestamp : Int;
  };

  public type NewActor = {
    policySignaturesByUser : Map.Map<Principal, List.List<PolicySignatureRecord>>;
  };

  public func run(old : Actor) : NewActor {
    {
      old with
      policySignaturesByUser = Map.empty<Principal, List.List<PolicySignatureRecord>>()
    };
  };
};
